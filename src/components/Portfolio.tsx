import { useState } from "react";
import { TextField, Button } from "@mui/material";
// import { useEthers, ConnectButton } from "@wagmi/react";

// Set the contract addresses
const tokenABI = "Your_Token_ABI";
const uniswapPairABI = "Uniswap_Pair_ABI";
const uniswapRouterABI = "Uniswap_Router_ABI";
const uniswapRouterAddress = "Uniswap_Router_Address";

const Swap = () => {
  // const { activateBrowserWallet, account } = useEthers();
  // const [fromToken, setFromToken] = useState("");
  // const [toToken, setToToken] = useState("");
  // const [amount, setAmount] = useState("");

  // // Connect to Goerli test network
  // const web3 = new Web3("https://goerli.infura.io/v3/YOUR_INFURA_ID");

  // // Create the contracts
  // const fromTokenContract = new web3.eth.Contract(tokenABI, fromToken);
  // const uniswapRouterContract = new web3.eth.Contract(
  //   uniswapRouterABI,
  //   uniswapRouterAddress
  // );

  // const handleSwap = async () => {
  //   // Validate from and to addresses
  //   if (!(web3.utils.isAddress(fromToken) && web3.utils.isAddress(toToken))) {
  //     alert("Invalid token address!");
  //     return;
  //   }

  //   // Check user balance
  //   let balance = await fromTokenContract.methods.balanceOf(account).call();
  //   balance = web3.utils.fromWei(balance, "ether");

  //   if (parseFloat(amount) > parseFloat(balance)) {
  //     alert("Insufficient balance!");
  //     return;
  //   }

  //   // Calculate price impact and show to user

  //   // Execute the swap
  //   const amountIn = web3.utils.toWei(amount, "ether");
  //   const amountOutMin = 0; // Calculate this based on price impact and slippage tolerance
  //   const path = [fromToken, toToken];
  //   const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
  //   const receipt = await uniswapRouterContract.methods
  //     .swapExactTokensForTokens(amountIn, amountOutMin, path, account, deadline)
  //     .send({ from: account });

  //   console.log("Transaction receipt:", receipt);
  // };

  return (
    <div>
      {/* <ConnectButton onConnect={() => activateBrowserWallet()} />
      <TextField
        required
        id="from-token-address"
        label="From Token Address"
        defaultValue=""
        variant="outlined"
        onChange={(e) => setFromToken(e.target.value)}
      />
      <TextField
        required
        id="to-token-address"
        label="To Token Address"
        defaultValue=""
        variant="outlined"
        onChange={(e) => setToToken(e.target.value)}
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
      </Button> */}
    </div>
  );
};

export default Swap;
