pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";


interface IEERC20 is IERC20 {
  function symbol() external view returns (string memory);
  function decimals() external view returns (uint8);
}
contract FakeUni {
  using SafeMath for uint;

  function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts) {
      require(deadline > 0);
      IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);

      uint[] memory amountOut = getAmountsOut(amountIn, path);
      require(amountOut[amountOut.length-1] >= amountOutMin,"invalid out");
      IERC20(path[path.length-1]).transfer(to, amountOut[amountOut.length-1]);
      uint256[] memory out = new uint256[](2);
      return out;
    }
    function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts){
      amounts = new uint[](path.length);
      uint8 din  = IEERC20(path[0]).decimals();
      uint8 dout = IEERC20(path[path.length-1]).decimals();
      uint dd = 18 + dout - din;
      uint amountOut = amountIn.mul(10** dd).div(1e18);

      amounts[path.length-1] = amountOut;
    }
}