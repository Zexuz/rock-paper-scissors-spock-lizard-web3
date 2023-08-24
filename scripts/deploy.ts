import {ethers} from "hardhat";

async function main() {
  //Rock, Paper, Scissors, Spock, Lizard
  const validMoves = ['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'];

  const salt = 'Robin';
  const move = 'Rock';

  const hash = ethers.solidityPackedKeccak256(['string'], [`${move}${salt}`]);
  const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  console.log(`Hash: ${hash}`)
  const rps = await ethers.deployContract("RPS", [hash, address], {
    value: ethers.parseEther('0.0001')
  });

  await rps.waitForDeployment();

  console.log(`Deployed to ${rps.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
