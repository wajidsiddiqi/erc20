const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("My Token Unit Tests", function () {
      let myToken, deployer, myTokenDeployed;

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["myToken"]);
        myTokenDeployed = await deployments.get("MyToken");
        myToken = await ethers.getContractAt(
          "MyToken",
          myTokenDeployed.address
        );
      });

      describe("Constructor", () => {
        it("Initializes the Token Correctly.", async () => {
          const name = await myToken.name();
          const symbol = await myToken.symbol();
          const owner = await myToken.owner();
          const maxSupply = await myToken.getMaxSupply();
          const maxHolding = await myToken.getMaxHolding();

          assert.equal(name, "MyToken");
          assert.equal(symbol, "MTK");
          assert.equal(owner, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
          assert.equal(maxSupply, BigInt(1000000) * BigInt(10) ** BigInt(18));
          assert.equal(maxHolding, 10000);
        });
      });

      describe("Mint", () => {
        it("reverts if exceeds the max holding", async () => {
          accounts = await ethers.getSigners();
          await expect(
            myToken.connect(accounts[1]).mint(BigInt(12000))
          ).to.be.revertedWithCustomError(
            myToken,
            "MyToken__ExceedingMaxHolding"
          );
        });

        it("reverts if exceeds the max supply", async () => {
          accounts = await ethers.getSigners();
          for (let i = 0; i < 100; i++) {
            await myToken.connect(accounts[i]).mint(BigInt(10000));
          }

          await expect(
            myToken.connect(accounts[109]).mint(BigInt(10000))
          ).to.be.revertedWithCustomError(myToken, "MyToken__ReachedMaxSupply");
        });

        it("successfully mints and updates", async () => {
          accounts = await ethers.getSigners();

          await myToken.connect(accounts[2]).mint(BigInt(5000));
          const userBalance = await myToken.balanceOf(accounts[2].address);
          const totalSupply = await myToken.totalSupply();

          assert.equal(userBalance, BigInt(5000));
          assert.equal(totalSupply, BigInt(5000));
        });
      });
    });
