// const main = async () => {
//   const [owner, randomPerson] = await hre.ethers.getSigners();
//   const accountBalance = await owner.getBalance();
//   const electionContractFactory = await hre.ethers.getContractFactory(
//     "Election"
//   );
//   const electionContract = await electionContractFactory.deploy();
//   await electionContract.deployed();

//   console.log("DEPLOYED BY: ", owner.address);
//   console.log("ACCOUNT BALANCE: ", accountBalance.toString());
//   console.log("DEPLOYED AT: ", electionContract.address);

//   const voteTxn = await electionContract.vote(1);
//   await voteTxn.wait();

//   let allVotes = await electionContract.getAllVotes();
//   console.log(
//     allVotes[0].id.toNumber(),
//     allVotes[0].name,
//     allVotes[0].voteCount.toNumber()
//   );
//   console.log(
//     allVotes[1].id.toNumber(),
//     allVotes[1].name,
//     allVotes[1].voteCount.toNumber()
//   );
// };

// const runMain = async () => {
//   try {
//     await main();
//     process.exit(0);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// runMain();

const main = async () => {
  const [owner, randomPerson1, randomPerson2] = await hre.ethers.getSigners();
  const accountBalance = await owner.getBalance();
  const electionContractFactory = await hre.ethers.getContractFactory(
    "Election"
  );
  const electionContract = await electionContractFactory.deploy();
  await electionContract.deployed();

  console.log("DEPLOYED BY: ", owner.address);
  console.log("ACCOUNT BALANCE: ", accountBalance.toString());
  console.log("DEPLOYED AT: ", electionContract.address);

  let voteTxn = await electionContract.vote(1);
  await voteTxn.wait();

  voteTxn = await electionContract.connect(randomPerson1).vote(2);
  await voteTxn.wait();

  voteTxn = await electionContract.connect(randomPerson2).vote(2);
  await voteTxn.wait();

  // let voters = await electionContract.getAllVoters();
  // console.log(voters);
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
