// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error MyToken__ReachedMaxSupply();
error MyToken__ExceedingMaxHolding();

contract MyToken is ERC20, Ownable {
    //* State Variables
    uint256 private constant MAX_SUPPLY = 1000000 * 10 ** 18;
    uint256 private constant MAX_HOLDING = 10000;

    constructor(
        address initialOwner
    ) ERC20("MyToken", "MTK") Ownable(initialOwner) {}

    function mint(uint256 amount) public {
        if ((totalSupply() + amount) * 10 ** 18 > MAX_SUPPLY)
            revert MyToken__ReachedMaxSupply();
        if (balanceOf(msg.sender) + amount > MAX_HOLDING)
            revert MyToken__ExceedingMaxHolding();
        _mint(msg.sender, amount);
    }

    function transfer(
        address to,
        uint256 value
    ) public virtual override returns (bool) {
        if (balanceOf(to) + value > MAX_HOLDING)
            revert MyToken__ExceedingMaxHolding();
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

    //*Getter Functions
    function getMaxSupply() public pure returns (uint256) {
        return MAX_SUPPLY;
    }

    function getMaxHolding() public pure returns (uint256) {
        return MAX_HOLDING;
    }
}
