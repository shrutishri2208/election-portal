const { expect } = require("chai");

describe("Test contract", function () {
  let owner;
  let electionContract;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const electionContractFactory = await ethers.getContractFactory("Election");
    electionContract = await electionContractFactory.deploy();
  });

  it("Counts the numbers of candidates", async function () {
    const count = await electionContract.candidateCount();
    expect(count).to.equal(2);
  });

  it("Assigns correct details to candidates", async function () {
    const c1 = await electionContract.candidates(1);
    expect(c1[1]).to.equal("Candidate 1");
  });
});
