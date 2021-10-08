pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract FakeUni {
  function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts) {
      require(deadline > 0);
      IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);
      IERC20(path[path.length-1]).transfer(to, amountOutMin);
      uint256[] memory out = new uint256[](2);
      return out;
    }
}