import { ethers as ethershardhat, hardhatArguments } from "hardhat";
import { deployments } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const daiRewards: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const ethers = hre.ethers;
    const provider = ethers.getDefaultProvider();
    const blockN = await provider.getBlockNumber();
    const currentBlock = await provider.getBlock(blockN);

    if (hardhatArguments.network === "mainnet") {
        const DAIReward = await deployments.getOrNull("DAILiquidityReward");
        const { log } = deployments;
        if (!DAIReward) {
            const namedAccounts = await hre.getNamedAccounts();
            const deployer = namedAccounts.deployer;

            let ctxDeployment = await deployments.get("Ctx");
            // let timelock = await deployments.get("Timelock");

            // TODO: Check This values
            let vestingRatio = "70"; //process.env.VESTING_RATIO;
            const vestingEnd = 1641085134; // 1/1/2022, 6:58:54 PM
            let rewardsToken = ctxDeployment.address;
            let stakingToken = ""; // DAI/TCAP SUSHI LP
            const guardian = "0xa70b638b70154edfcbb8dbbbd04900f328f32c35"; // Dev multisign;

            console.log("deploying liquidity rewards for DAI/TCAP LP");

            //ETH
            let rewardDeployment = await deployments.deploy(
                "DAILiquidityReward",
                {
                    contract: "LiquidityReward",
                    from: deployer,
                    args: [
                        guardian,
                        rewardsToken,
                        stakingToken,
                        vestingEnd,
                        vestingRatio,
                    ],
                    skipIfAlreadyDeployed: true,
                    log: true,
                    nonce: 46,
                }
            );
            log(
                `Liquidity Reward deployed at ${rewardDeployment.address} for ${rewardDeployment.receipt?.gasUsed}`
            );
        } else {
            log("Contract already deployed");
        }
    }
};
export default daiRewards;
