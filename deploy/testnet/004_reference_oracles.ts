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

        let TCAPOracle, BTCOracle, WETHOracle, DAIOracle;
        try {
            TCAPOracle = await deployments.get("TCAPOracle");
        } catch (error) {
            log(error.message);
            let oracleAddress = process.env.TCAP_ORACLE as string;
            const deployResult = await deployIfDifferent(
                ["data"],
                "TCAPOracle",
                { from: deployer },
                "ChainlinkOracle",
                oracleAddress
            );
            TCAPOracle = await deployments.get("TCAPOracle");
            if (deployResult.newlyDeployed) {
                log(
                    `Oracle deployed at ${TCAPOracle.address} for ${deployResult.receipt.gasUsed}`
                );
            }
            try {
                BTCOracle = await deployments.get("BTCOracle");
            } catch (error) {
                log(error.message);
                oracleAddress = process.env.BTC_ORACLE as string;
                const deployResult = await deployIfDifferent(
                    ["data"],
                    "BTCOracle",
                    { from: deployer },
                    "ChainlinkOracle",
                    oracleAddress
                );
                BTCOracle = await deployments.get("BTCOracle");
                if (deployResult.newlyDeployed) {
                    log(
                        `Price Feed Oracle deployed at ${BTCOracle.address} for ${deployResult.receipt.gasUsed}`
                    );
                }
                try {
                    WETHOracle = await deployments.get("WETHOracle");
                } catch (error) {
                    log(error.message);
                    let oracleAddress = process.env.ETH_ORACLE as string;
                    const deployResult = await deployIfDifferent(
                        ["data"],
                        "WETHOracle",
                        { from: deployer },
                        "ChainlinkOracle",
                        oracleAddress
                    );
                    WETHOracle = await deployments.get("WETHOracle");
                    if (deployResult.newlyDeployed) {
                        log(
                            `Price Feed Oracle deployed at ${WETHOracle.address} for ${deployResult.receipt.gasUsed}`
                        );
                    }
                    try {
                        DAIOracle = await deployments.get("DAIOracle");
                    } catch (error) {
                        log(error.message);
                        let oracleAddress = process.env.DAI_ORACLE as string;
                        const deployResult = await deployIfDifferent(
                            ["data"],
                            "DAIOracle",
                            { from: deployer },
                            "ChainlinkOracle",
                            oracleAddress
                        );
                        DAIOracle = await deployments.get("DAIOracle");
                        if (deployResult.newlyDeployed) {
                            log(
                                `Price Feed Oracle deployed at ${DAIOracle.address} for ${deployResult.receipt.gasUsed}`
                            );
                        }
                    }
                }
            }
        }
    }
};
module.exports.tags = ["Oracle", "ChainlinkOracle"];
