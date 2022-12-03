const main = async () => {
    const weth = 1000000000000000000;
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy(
        {
            value: hre.ethers.utils.parseEther("0.1"),
        }
    );
    await waveContract.deployed();
    console.log("Contract addy:", waveContract.address);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());
    /*
     * Get Contract balance to see what happened!
     */
    //contractBalance 
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        "Contract balance:",
        contractBalance / weth
        //hre.ethers.utils.formatEther(contractBalance)
    );

    /**
     * Let's send a few waves!
     */
    let waveTxn = await waveContract.wave("A message!");
    await waveTxn.wait(); // Wait for the transaction to be mined

    const [_, randomPerson] = await hre.ethers.getSigners();
    waveTxn2 = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn2.wait(); // Wait for the transaction to be mined


    contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );

    //new contract balance 
    console.log(
        "Contract balance:",
        //hre.ethers.utils.formatEther(contractBalance)
        contractBalance / weth
    );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
    waveCount = await waveContract.getTotalWaves();
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
