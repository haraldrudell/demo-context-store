const Ballot = artifacts.require('Ballot')

contract('Ballot suite', async (accounts) => {

  it('Check chairperson constructor invoker is account 0', async () => {
    const expected = accounts[0] // like: 0x627306090abab3a6e1400e9345bc60c78a8bef57
    const instance = await Ballot.deployed()
    const chairperson = await instance.chairperson.call() // compiler generated getter function
    assert.equal(chairperson, expected)
  })

  it('Check initial winning proposal', async () => {
    const instance = await Ballot.deployed()
    const p = await instance.winningProposal()
    assert.equal(p, 0)
  })

  it('Vote', async () => {
    const proposalNo = 1
    const instance = await Ballot.deployed()
    await instance.vote(proposalNo) // {tx, receipt, logs}
    const uint256 = await instance.winningProposal() // {s: number 1, e: number 0, c: [number 1]}
    const winningProposal_ = uint256.c[0] // maybe status, error and c
    assert.equal(winningProposal_, proposalNo)
  })
  /*
  it("should call a function that depends on a linked library", async () => {
    let meta = await Ballot.deployed();
    let outCoinBalance = await meta.getBalance.call(accounts[0]);
    let metaCoinBalance = outCoinBalance.toNumber();
    let outCoinBalanceEth = await meta.getBalanceInEth.call(accounts[0]);
    let metaCoinEthBalance = outCoinBalanceEth.toNumber();
    assert.equal(metaCoinEthBalance, 2 * metaCoinBalance);

  });

  it("should send coin correctly", async () => {

    // Get initial balances of first and second account.
    let account_one = accounts[0];
    let account_two = accounts[1];

    let amount = 10;


    let instance = await Ballot.deployed();
    let meta = instance;

    let balance = await meta.getBalance.call(account_one);
    let account_one_starting_balance = balance.toNumber();

    balance = await meta.getBalance.call(account_two);
    let account_two_starting_balance = balance.toNumber();
    await meta.sendCoin(account_two, amount, {from: account_one});

    balance = await meta.getBalance.call(account_one);
    let account_one_ending_balance = balance.toNumber();

    balance = await meta.getBalance.call(account_two);
    let account_two_ending_balance = balance.toNumber();

    assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
  })*/
})
