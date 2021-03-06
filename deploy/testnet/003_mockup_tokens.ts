import { hardhatArguments } from "hardhat";
require("dotenv").config();
module.exports = async ({ getNamedAccounts, deployments }: any) => {
    let initial_run = process.env.INITIAL_RUN == "true" ? true : false;
    if (
        (hardhatArguments.network === "rinkeby" ||
            hardhatArguments.network === "ropsten" ||
            hardhatArguments.network === "hardhat") &&
        initial_run
    ) {
        const { deployIfDifferent, log } = deployments;
        const { deployer } = await getNamedAccounts();

        log(
            `${hardhatArguments.network} found, deploying mockup DAI contracts`
        );

        //Deploy Mock DAIs
        let DAI, WBTC, WETH;
        try {
            DAI = await deployments.get("DAI");
        } catch (error) {
            log(error.message);

            const deployResult = await deployIfDifferent(
                ["data"],
                "DAI",
                { from: deployer },
                "DAI"
            );
            DAI = await deployments.get("DAI");
            if (deployResult.newlyDeployed) {
                log(
                    `DAI deployed at ${DAI.address} for ${deployResult.receipt.gasUsed}`
                );
            }

            try {
                WBTC = await deployments.get("WBTC");
            } catch (error) {
                log(error.message);

                const deployResult = await deployIfDifferent(
                    ["data"],
                    "WBTC",
                    { from: deployer },
                    "WBTC"
                );
                WBTC = await deployments.get("WBTC");
                if (deployResult.newlyDeployed) {
                    log(
                        `BTC deployed at ${WBTC.address} for ${deployResult.receipt.gasUsed}`
                    );
                }
                try {
                    WETH = await deployments.get("WETH");
                } catch (error) {
                    log(error.message);

                    const deployResult = await deployIfDifferent(
                        ["data"],
                        "WETH",
                        { from: deployer },
                        "WETH"
                    );
                    WETH = await deployments.get("WETH");
                    if (deployResult.newlyDeployed) {
                        log(
                            `WETH deployed at ${WETH.address} for ${deployResult.receipt.gasUsed}`
                        );
                    }
                }
            }
        }
    }
};
module.exports.tags = ["DAI", "WBTC", "WETH"];
