import "./App.css";
import React, { useEffect, useState } from "react";
import abi from "./utils/Election.json";

const ethers = require("ethers");
function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allDetails, setAllDetails] = useState([]);
  const [loader, setLoader] = useState(false);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState(false);
  //const [candidateCount, setCandidateCount] = useState();

  const contractAddress = "0x8d6be80b00416D8C8a9b431AD8028B7d83687DE6";
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
        getDetails();
        //setCandidateCount(await electionContract.candidateCount());
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
      getDetails();
    } catch (error) {
      console.log(error);
    }
  };
  const vote = async (candidateID) => {
    setVoted(false);
    setLoader(false);
    setError(false);

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
        let signerAddress = await signer.getAddress();
        console.log("SIGNER: ", signerAddress);
        console.log("TRYING TO VOTE: ", candidateID);
        const voteTxn = await electionContract.vote(candidateID, {
          gasLimit: 1000000,
        });
        console.log("Mining...", voteTxn.hash);
        setLoader(true);

        await voteTxn.wait();
        setLoader(false);
        setVoted(true);

        console.log("Mined...", voteTxn.hash);

        console.log("VOTED FOR CANDIDATE ", candidateID);

        getDetails();
      } else {
        console.log("No ethereum object found");
      }
    } catch (error) {
      console.log(error);
      console.log("YOU CAN ONLY VOTE ONCE");
      setLoader(false);
      setError(true);
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
        <h1>ELECTION PORTAL</h1>
      </div>
      <hr></hr>
      <div className="connectWallet">
        {!currentAccount && (
          <button onClick={connectAccount}>Connect your wallet to vote!</button>
        )}
      </div>
      <div className="voteContainer">
        <h1>Select a candidate</h1>
        <h4>You can only vote once, choose wisely!</h4>
        {/* <div>
          <button onClick={() => vote("1")}>Candidate 1</button>
          <button onClick={() => vote("2")}>Candidate 2</button>
          <button onClick={() => vote("3")}>Candidate 3</button>
        </div> */}
        {allDetails.map((candidate, index) => {
          return (
            <button key={index} onClick={() => vote(index + 1)}>
              {candidate.name}
            </button>
          );
        })}
      </div>
      <hr></hr>
      <div className="resultContainer">
        {/* <button onClick={getDetails}>Get results</button> */}
        <table>
          <tr>
            <th>ID</th>
            <th>Name of the candidate</th>
            <th>No. of votes</th>
          </tr>
          {allDetails.map((detail, index) => {
            return (
              <tr key={index}>
                <td>{detail.id}</td>
                <td>{detail.name}</td>
                <td>{detail.voteCount}</td>
              </tr>
            );
          })}
        </table>
      </div>
      {loader && <h3>LOADING...</h3>}
      {voted && <h3>YOUR VOTE HAS BEEN RECORDED!</h3>}
      {error && <h3>YOU CAN ONLY VOTE ONCE!</h3>}
    </div>
  );
}

export default App;
