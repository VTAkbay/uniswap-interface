import { ethers } from "ethers";
import {
  ChainId,
  Token,
  Fetcher,
  Trade,
  TokenAmount,
  TradeType,
  Route,
} from "@uniswap/sdk";
import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    ChainId.MAINNET,
    ChainId.ROPSTEN,
    ChainId.RINKEBY,
    ChainId.GÖRLI,
    ChainId.KOVAN,
  ],
});

function Swap() {
  const [fromTokenAddress, setFromTokenAddress] = useState("");
  const [toTokenAddress, setToTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const { activate, library, account } = useWeb3React<Web3Provider>();

  const handleConnectWallet = async () => {
    activate(injectedConnector);
  };

  const handleSwap = async () => {
    if (!fromTokenAddress || !ethers.utils.isAddress(fromTokenAddress)) {
      return alert("Invalid from token address!");
    }

    if (!toTokenAddress || !ethers.utils.isAddress(toTokenAddress)) {
      return alert("Invalid to token address!");
    }

    if (!amount || isNaN(+amount)) {
      return alert("Invalid amount!");
    }

    const fromToken = new Token(ChainId.GÖRLI, fromTokenAddress, 18);
    const toToken = new Token(ChainId.GÖRLI, toTokenAddress, 18);

    const pair = await Fetcher.fetchPairData(fromToken, toToken, library);

    const route = new Route([pair], fromToken);

    const trade = new Trade(
      route,
      new TokenAmount(fromToken, ethers.utils.parseEther(amount).toString()),
      TradeType.EXACT_INPUT
    );

    const slippageTolerance = new TokenAmount(
      fromToken,
      ethers.utils.parseEther("0.005").toString()
    ); // 0.5% slippage tolerance

    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
    const path = [fromToken, toToken];
    const to = account;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    // Get the Uniswap Router contract instance
    const uniswapRouter = new ethers.Contract(
      "UNISWAP_ROUTER_ADDRESS",
      [
        {
          inputs: [],
          name: "WETH",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "tokenA",
              type: "address",
            },
            {
              internalType: "address",
              name: "tokenB",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amountADesired",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountBDesired",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountAMin",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountBMin",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "addLiquidity",
          outputs: [
            {
              internalType: "uint256",
              name: "amountA",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountB",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "liquidity",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amountTokenDesired",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountTokenMin",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountETHMin",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "addLiquidityETH",
          outputs: [
            {
              internalType: "uint256",
              name: "amountToken",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountETH",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "liquidity",
              type: "uint256",
            },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "factory",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountOut",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "reserveIn",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "reserveOut",
              type: "uint256",
            },
          ],
          name: "getAmountIn",
          outputs: [
            {
              internalType: "uint256",
              name: "amountIn",
              type: "uint256",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountIn",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "reserveIn",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "reserveOut",
              type: "uint256",
            },
          ],
          name: "getAmountOut",
          outputs: [
            {
              internalType: "uint256",
              name: "amountOut",
              type: "uint256",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountOut",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "path",
              type: "address[]",
            },
          ],
          name: "getAmountsIn",
          outputs: [
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountIn",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "path",
              type: "address[]",
            },
          ],
          name: "getAmountsOut",
          outputs: [
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountA",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "reserveA",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "reserveB",
              type: "uint256",
            },
          ],
          name: "quote",
          outputs: [
            {
              internalType: "uint256",
              name: "amountB",
              type: "uint256",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "tokenA",
              type: "address",
            },
            {
              internalType: "address",
              name: "tokenB",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "liquidity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountAMin",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountBMin",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "removeLiquidity",
          outputs: [
            {
              internalType: "uint256",
              name: "amountA",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountB",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "liquidity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountTokenMin",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountETHMin",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "removeLiquidityETH",
          outputs: [
            {
              internalType: "uint256",
              name: "amountToken",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountETH",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "liquidity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountTokenMin",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountETHMin",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "removeLiquidityETHSupportingFeeOnTransferTokens",
          outputs: [
            {
              internalType: "uint256",
              name: "amountETH",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "liquidity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountTokenMin",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountETHMin",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "approveMax",
              type: "bool",
            },
            {
              internalType: "uint8",
              name: "v",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "r",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
            },
          ],
          name: "removeLiquidityETHWithPermit",
          outputs: [
            {
              internalType: "uint256",
              name: "amountToken",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountETH",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "liquidity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountTokenMin",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountETHMin",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "approveMax",
              type: "bool",
            },
            {
              internalType: "uint8",
              name: "v",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "r",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
            },
          ],
          name: "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
          outputs: [
            {
              internalType: "uint256",
              name: "amountETH",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "tokenA",
              type: "address",
            },
            {
              internalType: "address",
              name: "tokenB",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "liquidity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountAMin",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountBMin",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "approveMax",
              type: "bool",
            },
            {
              internalType: "uint8",
              name: "v",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "r",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
            },
          ],
          name: "removeLiquidityWithPermit",
          outputs: [
            {
              internalType: "uint256",
              name: "amountA",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountB",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountOut",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "path",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "swapETHForExactTokens",
          outputs: [
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountOutMin",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "path",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "swapExactETHForTokens",
          outputs: [
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountOutMin",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "path",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "swapExactETHForTokensSupportingFeeOnTransferTokens",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountIn",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountOutMin",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "path",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "swapExactTokensForETH",
          outputs: [
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountIn",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountOutMin",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "path",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "swapExactTokensForETHSupportingFeeOnTransferTokens",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountIn",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountOutMin",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "path",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "swapExactTokensForTokens",
          outputs: [
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountIn",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountOutMin",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "path",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountOut",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountInMax",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "path",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "swapTokensForExactETH",
          outputs: [
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amountOut",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountInMax",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "path",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "swapTokensForExactTokens",
          outputs: [
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      library
    );

    // Estimate the gas for the transaction
    const gasEstimate =
      await uniswapRouter.estimateGas.swapExactTokensForTokens(
        trade.inputAmount.raw.toString(),
        amountOutMin.toString(),
        path.map((token) => token.address),
        to,
        deadline
      );

    // Perform the transaction
    const transaction = await uniswapRouter.swapExactTokensForTokens(
      trade.inputAmount.raw.toString(),
      amountOutMin.toString(),
      path.map((token) => token.address),
      to,
      deadline,
      { gasLimit: gasEstimate }
    );

    console.log(`Transaction hash: ${transaction.hash}`);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleConnectWallet}>
        Connect Wallet
      </Button>
      <TextField
        required
        id="from-token-address"
        label="From Token Address"
        defaultValue=""
        variant="outlined"
        onChange={(e) => setFromTokenAddress(e.target.value)}
      />
      <TextField
        required
        id="to-token-address"
        label="To Token Address"
        defaultValue=""
        variant="outlined"
        onChange={(e) => setToTokenAddress(e.target.value)}
      />
      <TextField
        required
        id="amount"
        label="Amount"
        type="number"
        defaultValue=""
        variant="outlined"
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSwap}>
        Swap
      </Button>
    </div>
  );
}

export default Swap;
