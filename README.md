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

## Notes
* All `console.error` would have been toasts, or snackbars, or something else, but I didn't want to spend the time to set that up.
* In hindsight, I should have used a different for state logic, like redux since using zustard still requires the use of `useEffects`, and I'm not sure if that's the best way to do it. (Only when reloading the page, which you do since there are no events to listen for in the smart contract)
* The deployers salt is generated automatically, and stored in local storage, so that if the user uses our secure salt, it gets stored in the browser, but also have the option to use their own salt, which they might remember better.
* We would also wait for the transaction to be completed before we move on to the next page


## How to play (strategy)
In a perfect world where no outside event could impact this game, the best strategy to play is either not to play at all, or to choose moves %100 randomly.
There are a couple of non-zero chances that could happen that would make this game not %100 random, and therefore exploitable.
* The other player is not playing randomly
* The other player is not using a secure salt
* The creator forgets to solve before the deadline
* The creator forgets the salt

### Breakdown (Game theory) 

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

