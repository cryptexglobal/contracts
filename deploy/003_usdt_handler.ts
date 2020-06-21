import {buidlerArguments} from "@nomiclabs/buidler";
module.exports = async ({getNamedAccounts, deployments}: any) => {
	if (
		buidlerArguments.network === "goerli" ||
		buidlerArguments.network === "ganache" ||
		buidlerArguments.network === "buidlerevm"
	) {
		const {deployIfDifferent, log} = deployments;
		const {deployer} = await getNamedAccounts();

		let handlerContract;
		try {
			handlerContract = await deployments.get("USDTTokenHandler");
		} catch (error) {
			log(error.message);

			const deployResult = await deployIfDifferent(
				["data"],
				"USDTTokenHandler",
				{from: deployer, gas: 4000000},
				"USDTTokenHandler"
			);
			handlerContract = await deployments.get("USDTTokenHandler");
			if (deployResult.newlyDeployed) {
				log(
					`USDTTokenHandler deployed at ${handlerContract.address} for ${deployResult.receipt.gasUsed}`
				);
			}
		}
	}
};
module.exports.tags = ["USDTTokenHandler"];