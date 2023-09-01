# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

Use Sepolia network to test the contract. 

## Notes
* The deployers salt is generated automatically, and stored in local storage, so that if the user uses our secure salt, it gets stored in the browser, but also have the option to use their own salt, which they might remember better.
* I would also like to wait for the transaction to be completed before we move on to the next page
* Even tho there was no CSS (and UX?) requirement, I could not help myself and added some CSS to make it look a little better, even tho it took away some time from the actual logic.
* I assume there is a reason there is no events emitted from the contract, so the user focuses on logic and code, and not the UX to change button texts once an "event" happens.

## How to play (What is the Mixed strategy Nash equilibria of this game?)
In a perfect world where no outside event could impact this game, the best strategy to play is either not to play at all, or to choose moves %100 randomly, since both players have the same chance of winning, losing, or tying.

However, there are a couple of non-zero chances that could happen that would make this game not %100 random, and therefore exploitable.
* The other player is not playing randomly
* The creator is not using a secure salt
* The creator forgets to solve before the deadline
* The creator forgets the salt

### Breakdown

Chance of a tie:
1/5 (since there are 5 moves and any move has a 1/5 chance of being selected by the other player)

Chance of a win:
Since any move wins over 2 out of the remaining 4 possible moves, the chance of winning (assuming both players select their moves entirely at random) is 2/5 = 40%.

Chance of a loss:
Similarly, since any move loses to 2 out of the remaining 4 possible moves, the chance of losing is also 2/5 = 40%.

In summary:

    Win: 40%
    Loss: 40%
    Draw: 20%

