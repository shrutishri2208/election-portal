const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const accountBalance = await owner.getBalance();
  const electionContractFactory = await hre.ethers.getContractFactory(
    "Election"
  );
  const electionContract = await electionContractFactory.deploy();
  await electionContract.deployed();

  console.log("DEPLOYED BY: ", owner.address);
  console.log("ACCOUNT BALANCE: ", accountBalance.toString());
  console.log("DEPLOYED AT: ", electionContract.address);
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
