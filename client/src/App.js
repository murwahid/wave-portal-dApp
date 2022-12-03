import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";
import {useForm} from "react-hook-form";


function App() {
  //state: current account
  const [CurrentAccount, setCurrentAccount] = useState("");
  //all waves 
  const [allWaves, setAllWaves] = useState([]);

  //state:message 
  const [waveMsg, setWaveMsg] = useState("");

  const {reset} = useForm();


  //contract address 
  const contractAddress = "0x1201ea31317bfD59f13d489E15Dd14C8e7fdb2b2";

  //abi
  const contractABI = abi.abi;

  // FUNCTION: WALLET VALIDATION
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  //  FUNCTION: CONNECT TO WALLET
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  // FUNCTION: GET ALL WAVES
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);

      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  //FUNCTION: WAVE
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        console.log("The Wave Msg Is:", waveMsg);

        const waveTxn = await wavePortalContract.wave(waveMsg);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }


  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  return (
    <div className="App">
      <nav class="navbar navbar-dark bg-dark">
        <img src="wvlogo.png" width="30" height="30" />
      </nav>
      <div className="content">
        <h1>Wave Portal 👋</h1>
        <div>
          <p>
            Hey I'm Mustafa! This is my "wall"! You can wave and say hello!
          </p>
        </div>
        <hr></hr>
        {/* Card body */}
        <div class="mt-2">
          <h3>Share A Funny Thought or Gif</h3>
          <div class="form-floating mx-1">
            <div class="content-block">
            <textarea
              class="form-control mb-3"
              placeholder="Leave a wave here"
              id="floatingTextarea"
              onChange={e => setWaveMsg(e.target.value)}
              style={{height: "100px"}}
            >
            </textarea>
            </div>
           
          </div>
          <div class="content-block">
            <button type="button" class="btn btn-primary btn-lg btn-block" onClick={wave}>👋 Wave At Me</button>
          </div>
          <div>
            {
              !CurrentAccount && <div class="content-block"><button type="button" class="btn btn-dark btn-lg btn-block mt-2" onClick={connectWallet}> 💳 Connect To Wallet</button></div>
            }
          </div>
          <div className="content-block">
            <button class="btn btn-dark btn-lg btn-block" onClick={getAllWaves}> ⭐	Get all Waves</button>
          </div>
        </div>

      </div>



      {
        allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "#fbc664", margin: "16px", padding: "8px", class: "shadow-lg" }}>
              <h2>Message: {wave.message}</h2>
              <hr></hr>
              <div><strong>Address:</strong> {wave.address}</div>
              <div><strong>Time:</strong> {wave.timestamp.toString()}</div>
            </div>
          )
        })
      }
    </div>
  );
}

export default App;
