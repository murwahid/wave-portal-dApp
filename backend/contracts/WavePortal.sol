//license 
pragma solidity ^0.8.0;
import "hardhat/console.sol";


//contract declaration 
contract WavePortal {
    uint256 totalWaves;

    //seed 
    uint private seed;

    event NewWave(address indexed from, uint256 timestamp, string message); 

    //custom wave datatype 
    struct Wave {
        address waver;
        string message;
        uint timestamp;
    }

    //array of structs 
    Wave[] waves;

    //mapping LastWavedAt
    mapping(address => uint) public lastWavedAt;



    //constructor 
    constructor() payable {
        console.log("I am a smart contract Dogg!");
        //initialize the initial seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public { //this function adds new waves to waveCounter
        totalWaves +=1;
        console.log("%s has waved", msg.sender, _message);
        //store the new message in the array 
        waves.push(Wave(msg.sender,_message, block.timestamp));

        // new seed generation
        seed = (block.difficulty + block.timestamp + seed) % 100;

        //require
        require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Must wait 30 seconds before waving again.");


        //updated wavedAt 
        lastWavedAt[msg.sender] = block.timestamp;
        
        //reporting the random number
        console.log("Random # generated: %d", seed);

        //50% chance user wins the prize 

        if(seed < 50) {
            console.log("%s won!", msg.sender);
            emit NewWave(msg.sender, block.timestamp, _message);
            uint256 prizeAmount = 0.01 ether;
            //uint256 prizeAmount = address(this).balance;
            require(prizeAmount <= address(this).balance, "Trying to withdraw more money than contract has.");
            payable(msg.sender).transfer(prizeAmount);
            //require(success, "Failed to withdraw money from contract");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }
    
    //this function gets all the waves 
    function getTotalWaves() public view returns (uint256) { 
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}