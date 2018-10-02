const Wrestling = artifacts.require('./Wrestling.sol')
const Ballot = artifacts.require('./Ballot.sol')
const proposalNames = ['one', 'two']

/*
module.exports2 = deployer => deployer.then(async () => {
	await deployer.deploy(Wrestling)
	await deployer.deploy(Ballot, proposalNames)
})
*/

// the exported function cannot be async but its deployer argument is a Promise
module.exports = deployer => deployer.then(() => asyncDeployer(deployer))

async function asyncDeployer(deployer) {
	await deployer.deploy(Wrestling)
	await deployer.deploy(Ballot, proposalNames)
}
