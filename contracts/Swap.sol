// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


struct Order {
  address user;
  address fromToken;
  address toToken;
  uint    price;
  uint    amount;
}

interface IUniswapV2Router02{
      function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}
interface IEERC20 is IERC20 {
  function symbol() external view returns (string memory);
  function decimals() external view returns (uint8);
}
contract Swap is AccessControl {
  using SafeMath for uint;
  using SafeERC20 for IEERC20;

  address public router;
  address public feeTo;
  address public operator;

  mapping(bytes32=>Order) public records;


  event changeOrderEvent(bytes32 indexed key, address user, address fromToken, address toToken, uint price, uint amount);
  // event insertOrder(bytes32 indexed key, address user, address fromToken, address toToken, uint price, uint amount);
  // event updateOrder(bytes32 indexed key, address user, address fromToken, address toToken, uint price, uint newAmount);
  // event deleteOrder(bytes32 indexed key, address user, address fromToken, address toToken, uint price, uint newAmount);
  constructor(address _admin, address _router, address _feeTo, address _operator) public {
    _setupRole(DEFAULT_ADMIN_ROLE, _admin);
    router = _router;
    feeTo = _feeTo;
    operator = _operator;
  }

  // TODO: need this?
  function setDepedency(address _router, address _feeTo, address _operator) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not admin");
    router = _router;
    feeTo = _feeTo;
    operator = _operator;
  }

  function getKey(address user, address fromToken, address toToken, uint price) public pure returns (bytes32 key){
    return keccak256(abi.encode(user, fromToken, toToken, price));
  }

  function changeOrder(address _fromToken, address _toToken, uint _price, uint _amount) external {
    require(_fromToken != _toToken);
    bytes32 key = getKey(msg.sender, _fromToken, _toToken, _price);

    // TODO: check the amount > 1 wan.
    // can only insert or change/delete himself's order.
    require(records[key].user == address(0) || records[key].user == msg.sender,"invalid sender");
    if(_amount == 0) {
      delete records[key];
    }else {
      records[key].user = msg.sender;
      records[key].fromToken = _fromToken;
      records[key].toToken = _toToken;
      records[key].price = _price;
      records[key].amount = _amount;
    }
    emit changeOrderEvent(key, msg.sender, _fromToken, _toToken, _price, _amount);
  }
  function checkPrice(address _tokenIn, address _tokenOut, uint256 _amountOutMin, uint256 _amountIn, uint256 price) public view returns (bool) {
    return _amountOutMin.mul(10**9).mul(IEERC20(_tokenIn).decimals()).div(IEERC20(_tokenOut).decimals()).div(_amountIn) >= price;
  }
  function swap(bytes32 key, address[] calldata path, uint256 _amountIn, uint256 _amountOutMin) external {
    require(msg.sender == operator,"invalid sender");
    require(path.length >= 2,"invalid path");
    require(_amountIn != 0 && _amountIn <= records[key].amount,"invalid amount");
    require(records[key].fromToken == path[0]);
    require(records[key].toToken == path[path.length-1]);
    address _tokenIn = path[0];

    //  check the _amountOutMin is >= price.
    require(checkPrice(_tokenIn,path[path.length-1], _amountOutMin, _amountIn, records[key].price), "invalid price");

    //  if not approve, delete this record.
    if( IEERC20(_tokenIn).balanceOf(records[key].user) < _amountIn 
      || IEERC20(_tokenIn).allowance(records[key].user, address(this)) < _amountIn ) {
            emit changeOrderEvent(key, records[key].user, records[key].fromToken, records[key].toToken, records[key].price, 0);
            delete records[key];
            return;
      }
    IEERC20(_tokenIn).safeTransferFrom(records[key].user, address(this), _amountIn);

    uint fee = _amountIn.mul(3).div(1000);
    IEERC20(_tokenIn).safeTransfer(feeTo, fee);

    uint amountInWithoutFee = _amountIn.sub(fee);
    IEERC20(_tokenIn).safeApprove(router, amountInWithoutFee);


    IUniswapV2Router02(router).swapExactTokensForTokens(amountInWithoutFee, _amountOutMin, path, records[key].user, block.timestamp);

    uint newAmount = records[key].amount.sub(_amountIn);
    emit changeOrderEvent(key, records[key].user, records[key].fromToken, records[key].toToken, records[key].price, newAmount);

    if(newAmount == 0) {
      delete records[key];
    } else {
      records[key].amount = newAmount;
    }
  }
}

