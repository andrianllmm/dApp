import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import hre from 'hardhat';

describe('Counter', function () {
  async function deployCounterFixture() {
    const [owner] = await hre.ethers.getSigners();
    const Counter = await hre.ethers.getContractFactory('Counter');
    const counter = await Counter.deploy();
    return { counter, owner };
  }

  describe('Deployment', function () {
    it('Should deploy the contract with count initialized to 0', async function () {
      const { counter } = await loadFixture(deployCounterFixture);
      expect(await counter.getCount()).to.equal(0);
    });
  });

  describe('Interactions', function () {
    it('Should increment the count by 1', async function () {
      const { counter } = await loadFixture(deployCounterFixture);
      await counter.increment();
      expect(await counter.getCount()).to.equal(1);
    });
  });
});
