const NumberStore = artifacts.require('./NumberStore')

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(NumberStore)
}
