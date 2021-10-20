// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
  function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
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
interface ISwap{
  function records(bytes32 key) external view returns (Order memory record);
  function router() external view returns (address _router);
  function swap(bytes32 key, address[] calldata path, uint256 _amountIn, uint256 _amountOut, bool isReflect, bool isPaid) external;
}
interface IEERC20 is IERC20 {
  function symbol() external view returns (string memory);
  function decimals() external view returns (uint8);
}