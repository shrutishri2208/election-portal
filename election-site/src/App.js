import "./App.css";
import React, { useEffect, useState } from "react";
import abi from "./utils/Election.json";

const ethers = require("ethers");
function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allDetails, setAllDetails] = useState([]);
  // const [candidateCount, setCandidateCount] = useState();

  const contractAddress = "0xB6059bD2a7E7C3A2B76afa31b8Fb4bC9Dd3e4320";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Get Metamask!");
      } else {
        console.log("Metamask object found!, ", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        let account = accounts[0];
        setCurrentAccount(account);
        console.log("Found an authorized account, ", account);
      } else {
        console.log("No connected account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectAccount = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const vote = async (candidateID) => {
    console.log("TRYING TO VOTE: ", candidateID);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const electionContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const voteTxn = await electionContract.vote(candidateID, {
          gasLimit: 100000,
        });
        console.log("Mining...", voteTxn.hash);

        await voteTxn.wait();

        console.log("Mined...", voteTxn.hash);
        console.log("VOTED FOR CANDIDATE ", candidateID);
        alert("YOUR VOTE HAS BEEN RECORDED!!");
      } else {
        console.log("No ethereum object found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDetails = async () => {
    console.log("GETTING CANDIDATE DETAILS...");

    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const electionContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // setCandidateCount(await electionContract.candidateCount());

        const details = await electionContract.getAllDetails();

        let detailsCleaned = [];

        for (let i = 1; i < details.length; i++) {
          detailsCleaned.push({
            id: details[i].id.toNumber(),
            name: details[i].name,
            voteCount: details[i].voteCount.toNumber(),
          });
        }

        setAllDetails(detailsCleaned);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="header">
        <h1>ELECTION RESULTS</h1>
      </div>
      <div>
        <h3>Select Candidate</h3>
      </div>

      <div>
        <button onClick={() => vote("1")}>Candidate 1</button>
        <button onClick={() => vote("2")}>Candidate 2</button>
      </div>
      <div>
        <button onClick={getDetails}>Get candidates details</button>
      </div>
      {!currentAccount && (
        <button onClick={connectAccount}>CONNECT WALLET</button>
      )}
      {allDetails.map((detail, index) => {
        return (
          <div
            key={index}
            style={{
              color: "black",
              marginTop: "16px",
              padding: "8px",
            }}
          >
            <div>ID: {detail.id}</div>
            <div>NAME: {detail.name}</div>
            <div>VOTE COUNT: {detail.voteCount}</div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
