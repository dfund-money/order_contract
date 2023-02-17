pragma solidity >=0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
interface IEERC20 is IERC20 {
  function symbol() external view returns (string memory);
  function decimals() external view returns (uint8);
}