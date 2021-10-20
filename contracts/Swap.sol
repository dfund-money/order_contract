// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2;
pragma experimental ABIEncoderV2;

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
  bool    isForever;
  uint    interval; // seconds
  uint    lastCheck; // only forever order
  uint    received;
}

interface IIUniswapV2Router02{
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
      ) external returns (uint[] memory amounts);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
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

  event ignore();  
  event changeOrderEvent(bytes32 indexed key, Order record);

  constructor(address _admin, address _router, address _feeTo, address _operator) public {
    _setupRole(DEFAULT_ADMIN_ROLE, _admin);
    router = _router;
    feeTo = _feeTo;
    operator = _operator;
  }

  function setDepedency(address _feeTo, address _operator) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not admin");
    feeTo = _feeTo;
    operator = _operator;
  }

  function getKey(address user, address fromToken, address toToken, uint price) public pure returns (bytes32 key){
    return keccak256(abi.encode(user, fromToken, toToken, price));
  }

  function changeOrder(address _fromToken, address _toToken, uint _price, uint _amount, bool _isForever, uint _interval) external {
    require(_fromToken != _toToken,'same');
    require(_price != 0,'invalid price');
    bytes32 key = getKey(msg.sender, _fromToken, _toToken, _price);

    records[key].user = msg.sender;
    records[key].fromToken = _fromToken;
    records[key].toToken = _toToken;
    records[key].price = _price;
    records[key].amount = _amount;
    records[key].isForever = _isForever;
    records[key].interval = _interval;
    
    emit changeOrderEvent(key, records[key]);
    if(_amount == 0) {
      delete records[key];
    } 
  }

  function getRealPrice(address _tokenIn, address _tokenOut, uint256 _amountOut, uint256 _amountIn) public view returns (uint256) {
    uint8 din  = IEERC20(_tokenIn).decimals();
    uint8 dout = IEERC20(_tokenOut).decimals();
    uint dd = 18 + din - dout;
    return   _amountOut.mul(10** dd).div(10**9).div(_amountIn);
  }

  function _swap(uint _amountIn, uint _amountOut, address[] memory path, bytes32 key, bool isReflect, bool isPaid) internal {
    // TODO  for FINN later.

    IEERC20(path[0]).safeTransferFrom(records[key].user, address(this), _amountIn);
    uint balanceThis = IERC20(path[0]).balanceOf(address(this));
    uint amountInWithFee = balanceThis;
    if(!isPaid) {
      amountInWithFee = balanceThis.mul(997).div(1000);
    } 
    IEERC20(path[0]).safeApprove(router, amountInWithFee);

    uint balanceBefore = IERC20(path[path.length - 1]).balanceOf(records[key].user);
    if(isReflect){
      IIUniswapV2Router02(router).swapExactTokensForTokensSupportingFeeOnTransferTokens(amountInWithFee, _amountOut, path, records[key].user, block.timestamp);
    } else {
      IIUniswapV2Router02(router).swapExactTokensForTokens(amountInWithFee, _amountOut, path, records[key].user, block.timestamp);
    }
    uint balanceAfter = IERC20(path[path.length - 1]).balanceOf(records[key].user);
    records[key].received = records[key].received.add(balanceAfter.sub(balanceBefore));
  }
  function swap(bytes32 key, address[] calldata path, uint256 _amountIn, uint256 _amountOut, bool isReflect, bool isPaid) external {
    require(msg.sender == operator,"invalid sender");
    require(path.length >= 2,"invalid path");
    require(_amountIn != 0 && _amountIn <= records[key].amount,"invalid amount");
    require(records[key].fromToken == path[0],'invalid fromToken');
    require(records[key].toToken == path[path.length-1],'invalid toToken');
    if(records[key].isForever) {
      require(block.timestamp >= records[key].lastCheck + records[key].interval,"interval");
    }
    address _tokenIn = path[0];
    //  check the _amountOut is >= price.
    require(getRealPrice(_tokenIn,path[path.length-1], _amountOut, _amountIn) >= records[key].price, "invalid price");

    if( IEERC20(_tokenIn).balanceOf(records[key].user) < _amountIn 
      || IEERC20(_tokenIn).allowance(records[key].user, address(this)) < _amountIn ) {
        emit ignore(); // operator will avoid this case.
        return;
    }

    _swap(_amountIn, _amountOut, path, key, isReflect, isPaid);
    
    if(records[key].isForever) {
      records[key].lastCheck = block.timestamp;
    } else {
      records[key].amount = records[key].amount.sub(_amountIn);
    }
    emit changeOrderEvent(key, records[key]);
    IEERC20(_tokenIn).safeTransfer(feeTo, IEERC20(_tokenIn).balanceOf(address(this)));
    if(records[key].amount == 0) {
      delete records[key];
    }
  }
}

