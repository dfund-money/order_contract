// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./interfaces/Interface.sol";


struct Order {
  address user;
  address fromToken;
  address toToken;
  uint    price;  // 最小单位 * e18
  uint    amount;
  bool    isForever;
  uint    interval; // seconds
  uint    lastCheck; // only forever order
  uint    received;
}


contract Swap  {
  using SafeMath for uint;
  using SafeERC20 for IEERC20;

  address public router;
  mapping(bytes32=>Order) public records;

  event changeOrderEvent(bytes32 indexed key, Order record);

  constructor(address _router) public {
    router = _router;
  }


  function getKey(address user, address fromToken, address toToken, uint price) public pure returns (bytes32 key){
    return keccak256(abi.encode(user, fromToken, toToken, price));
  }

  function changeOrder(address _fromToken, address _toToken, uint _price, uint _amount, bool _isForever, uint _interval) external {
    require(_fromToken != _toToken,'same');
    require(_price != 0,'invalid price');
    bytes32 key = getKey(msg.sender, _fromToken, _toToken, _price);
    // TODO 相同的user才能覆盖.

    records[key].user = msg.sender;
    records[key].fromToken = _fromToken;
    records[key].toToken = _toToken;
    records[key].price = _price;
    records[key].amount = _amount;
    records[key].isForever = _isForever;
    records[key].interval = _interval;
    
    emit changeOrderEvent(key, records[key]);
  }


  function _swap(uint _amountIn, uint _amountOutMin, address[] memory path, bytes32 key) internal returns(uint amountOut) {

  }
  function swap(bytes32 key, address[] calldata path) external {
    require(path.length >= 2,"invalid path");
    require(records[key].fromToken == path[0],'invalid fromToken');
    require(records[key].toToken == path[path.length-1],'invalid toToken');
    if(records[key].isForever) {
      require(block.timestamp >= records[key].lastCheck + records[key].interval,"interval");
    }

    uint _amountIn = records[key].amount;
    IEERC20 tokenIn = IEERC20(path[0]);
    if( tokenIn.balanceOf(records[key].user) < _amountIn || tokenIn.allowance(records[key].user, address(this)) < _amountIn ) {
        return;
    }

    tokenIn.safeTransferFrom(records[key].user, address(this), _amountIn);
    tokenIn.safeApprove(router, _amountIn);

    uint[] memory amounts = IIUniswapV2Router02(router).swapExactTokensForTokens(_amountIn, _amountOutMin, path, records[key].user, block.timestamp);
    
    return amounts[amounts.length-1];
    records[key].received = 

    uint amountOutMin = 0;
    records[key].received = _swap(_amountIn, amountOutMin, path, key);
    
    if(records[key].isForever) {
      records[key].lastCheck = block.timestamp;
    } else {
      records[key].amount = records[key].amount.sub(_amountIn);
    }
    emit changeOrderEvent(key, records[key]);
  }
}

