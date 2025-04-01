import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const CounterModule = buildModule('CounterDeployment', (m) => {
  const counter = m.contract('Counter', []);
  return { counter };
});

export default CounterModule;
