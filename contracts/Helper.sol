// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/common.sol";

contract Helper is AccessControl {
  using SafeMath for uint;
  using SafeERC20 for IEERC20;

  address public  mToken;
  address public  swap;
  address public  feeTo; 
  address public  operator;
  uint    public  discount;

  constructor(address _admin, address _mToken, address _swap, address _feeTo, address _operator, uint _discount) public {
    _setupRole(DEFAULT_ADMIN_ROLE, _admin);
    discount = _discount;
    swap = _swap;
    feeTo = _feeTo;
    mToken = _mToken;
    operator = _operator;
  }

  function setDepedency(address _mToken, address _feeTo, uint _discount) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not admin");
    require(_discount <= 8, "invalid");
    mToken = _mToken;
    discount = _discount;
    feeTo = _feeTo;
  }
  function calMtokenAmount(uint256 _amountIn,address[] memory mTokenPath) public returns(uint){
    uint mtokenPayAmount = _amountIn.mul(997).mul(discount).div(1000).div(10);
    if(mTokenPath[0] != mToken){ // sell not mtoken
      address router = ISwap(swap).router();
      uint[] memory out = IIUniswapV2Router02(router).getAmountsOut(_amountIn.mul(997).mul(discount).div(1000).div(10), mTokenPath);
      mtokenPayAmount = out[out.length-1];
    }
    return mtokenPayAmount;
  }
  function tryPayToken(bytes32 key,address[] memory mTokenPath, uint256 _amountIn) internal returns(bool){
    Order memory record =  ISwap(swap).records(key);

    uint allowance = IEERC20(mToken).allowance(record.user, address(this));
    if(allowance > 0) {
      if(discount == 0) {
        return true;
      } else {
        uint mtokenPayAmount = calMtokenAmount(_amountIn, mTokenPath);
        if(allowance >= mtokenPayAmount && IEERC20(mToken).balanceOf(record.user) >= mtokenPayAmount){
          IEERC20(mToken).safeTransferFrom(record.user, feeTo, mtokenPayAmount);
          return true;
        }
      }
    }
    return false;
  }

  function helpSwap(bytes32 key,address[] calldata mTokenPath, address[] calldata path, uint256 _amountIn, uint256 _amountOut, bool isReflect) external {
    require(msg.sender == operator,"invalid sender");
    require(mTokenPath[mTokenPath.length-1] == mToken,"invalid mtoken");
    require(mTokenPath[0] == path[0], "invalid path");
    bool isPaid = tryPayToken(key, mTokenPath, _amountIn);
    ISwap(swap).swap(key, path, _amountIn, _amountOut, isReflect, isPaid);
  }

}