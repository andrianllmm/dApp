import hre from 'hardhat';
import CounterModule from '../ignition/modules/Counter';

async function main() {
  const { counter } = await hre.ignition.deploy(CounterModule);
  await counter.waitForDeployment();

  console.log(`Counter deployed to: ${await counter.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
