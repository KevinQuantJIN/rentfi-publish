import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

interface ContractDeployment {
  name: string;
  args: any[]; // Replace any[] with the actual types of your constructor arguments
}
/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

//   const contractsToDeploy: ContractDeployment[] = [
//     {
//       name: "RentalAgreement",
//       args: [
//         "0xE34D138fCEFb90817b3D47C70cc433Ea6d747eBa",
//         "0xC7E021e6064fa7E2ebcffD9860319c35933AECd4",
//         100,
//         50,
//         50,
//         "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
//         "hhh",
//         "hhh",
//         "hhh",
//         "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A",
//         "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
//       ],
//     },
//     {
//       name: "RentalCashFlowNFT",
//       args: [],
//     },
//     {
//       name: "RentalFactory",
//       args: [],
//     },
//     // Add more contracts as needed
//   ];

  // Loop through the contracts and deploy each one
    await deploy("RentalAgreement", {
      from: deployer,
      args: ["0xE34D138fCEFb90817b3D47C70cc433Ea6d747eBa",
              "0xC7E021e6064fa7E2ebcffD9860319c35933AECd4",
              100,
              50,
              50,
              "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
              "hhh",
              "hhh",
              "hhh",
              "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A",
              "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",],
      log: true,
      gasLimit:6000000,
      autoMine: true,
    });

    // Get the deployed contract
    // const yourContract = await hre.ethers.getContract("YourContract", deployer);

};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags rentalagreement
deployYourContract.tags = ["rentalagreement"];
