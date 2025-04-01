// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "hardhat/console.sol";

contract Counter {
    int64 private count = 0;

    event CountChanged(int64 newCount);

    function increment() public {
        count++;
        emit CountChanged(count);
    }

    function getCount() public view returns (int64) {
        return count;
    }
}