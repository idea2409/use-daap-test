import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { providers } from "ethers";
import "./App.css";
import { useState } from "react";
import { Contract } from "@ethersproject/contracts";

const provider = new providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = "0x364a93FA436C7d8a967B151cb76f8Be2b2D4f6f5";
const abi = [
  {
    inputs: [],
    name: "retrieve",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "num", type: "uint256" }],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const contract = new Contract(contractAddress, abi, signer);

function App() {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const userBalance = useEtherBalance(account);

  const [retrivedData, setRetrivedData] = useState("");
  const [storingData, setStoringData] = useState("");

  const retrieve = async () => {
    const res = await contract.retrieve();
    setRetrivedData(parseInt(res._hex, 16));
  };

  const store = async () => {
    await contract.store(storingData.toString(16));
  };

  return (
    <div>
      {account ? (
        <button onClick={activateBrowserWallet}> Connect </button>
      ) : (
        <button onClick={deactivate}> Disconnect </button>
      )}
      {account && <p>Account: {account}</p>}
      {userBalance && <p>Ether balance: {formatEther(userBalance)} ETH </p>}
      <br />
      {account && (
        <>
          <input
            onChange={(e) => setStoringData(e.target.value)}
            value={storingData}
          ></input>
          <button onClick={() => store()}>store</button>
          <p>retrivedData: {retrivedData}</p>
          <button onClick={() => retrieve()}>retrive</button>
        </>
      )}
    </div>
  );
}

export default App;
