//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Election {
    constructor() {
        console.log("I AM A SMART CONTRACT!");
        addCandidate("NULL");
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
        addCandidate("Candidate 3");
    }

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    //mapping(uint256 => Candidate) public candidates;

    Candidate[] candidates;

    //address[] public voters;

    mapping(address => bool) public voters;

    uint256 public candidateCount;

    function addCandidate(string memory _name) private {
        candidates.push(Candidate(candidateCount, _name, 0));
        console.log("Candidate %d created!", candidateCount);
        candidateCount += 1;
    }

    function vote(uint256 _candidateID) public {
        require(!voters[msg.sender], "You can only vote once!");

        require(_candidateID > 0 && _candidateID <= candidateCount);

        voters[msg.sender] = true;
        //voters.push(msg.sender);

        candidates[_candidateID].voteCount += 1;

        console.log(
            "VOTED FOR CANDIDATE %d %s",
            candidates[_candidateID].id,
            candidates[_candidateID].name
        );
        console.log("NUMBER OF VOTES ", candidates[_candidateID].voteCount);
    }

    function getAllDetails() public view returns (Candidate[] memory) {
        return candidates;
    }

    // function getAllVoters() public view returns (address[] memory) {
    //     return voters;
    // }
}
