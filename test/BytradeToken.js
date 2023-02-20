const Token = artifacts.require("BytradeToken");

contract("Token", accounts => {
  let token;

  beforeEach(async () => {
    token = await Token.new(accounts[0]);
  });

  // it("should have correct name, symbol, and decimals", async () => {
  //   const name = await token.name();
  //   const symbol = await token.symbol();
  //   const decimals = await token.decimals();
  //   assert.equal(name, "ByTrade");
  //   assert.equal(symbol, "BTT");
  //   assert.equal(decimals, 18);
  // });

  // it("should assign initial balance to owner", async () => {
  //   const balance = await token.balanceOf(accounts[0]);
  //   assert.equal(balance.toString(), web3.utils.toWei("10000000000"));
  // });

  // it("should transfer tokens between accounts", async () => {
  //   const from = accounts[0];
  //   const to = accounts[1];
  //   const amount = web3.utils.toWei("100");

  //   await token.transfer(to, amount, { from });

  //   const fromBalance = await token.balanceOf(from);
  //   assert.equal(fromBalance.toString(), web3.utils.toWei("9999999900"));

  //   const toBalance = await token.balanceOf(to);
  //   assert.equal(toBalance.toString(), amount);
  // });

  // it("should not allow transfer more than balance", async () => {
  //   const from = accounts[0];
  //   const to = accounts[1];
  //   const amount = web3.utils.toWei("100000000001");

  //   try {
  //     await token.transfer(to, amount, { from });
  //     assert.fail("Transfer succeeded even though balance was too low");
  //   } catch (err) {
  //     assert(err.message.includes("revert"), "Expected revert but got " + err);
  //   }
  // });

  // it("should not allow transfer from zero address", async () => {
  //   const from = "0x0000000000000000000000000000000000000000";
  //   const to = accounts[1];
  //   const amount = web3.utils.toWei("100");

  //   try {
  //     await token.transfer(to, amount, { from });
  //     assert.fail("Transfer succeeded even though from address was zero");
  //   } catch (err) {
  //     assert(err.message.includes("revert"), "Expected revert but got " + err);
  //   }
  // });

  // it("should not allow transfer to zero address", async () => {
  //   const from = accounts[0];
  //   const to = "0x0000000000000000000000000000000000000000";
  //   const amount = web3.utils.toWei("100");

  //   try {
  //     await token.transfer(to, amount, { from });
  //     assert.fail("Transfer succeeded even though to address was zero");
  //   } catch (err) {
  //     assert(err.message.includes("revert"), "Expected revert but got " + err);
  //   }
  // });

  it("should allow owner to transfer ownership", async () => {
    const newOwner = accounts[1];
    await token.transferOwnership(newOwner, { from: accounts[0] });
    const owner = await token.owner();
    assert.equal(owner, newOwner);
  });

  it("should not allow non-owner to transfer ownership", async () => {
    const newOwner = accounts[1];
    try {
      await token.transferOwnership(newOwner, { from: accounts[1] });
      assert.fail("Ownership transfer succeeded even though caller was not owner");
    } catch (err) {
      assert(err.message.includes("revert"), "Expected revert but got " + err);
    }
  });

  it("should allow owner to transfer ownership to zero address to renounce ownersip", async () => {
    try {
      await token.transferOwnership("0x0000000000000000000000000000000000000000", { from: accounts[0] });
      assert.equal(owner, "0x0000000000000000000000000000000000000000");
    } catch (err) {
      assert(err.message.includes("revert"), "Expected revert but got " + err);
    }
  });

  it("should emit OwnershipTransferred event when ownership is transferred", async () => {
    const newOwner = accounts[1];
    const { logs } = await token.transferOwnership(newOwner, { from: accounts[0] });
    assert.equal(logs.length, 1);
    assert.equal(logs[0].event, "OwnershipTransferred");
    assert.equal(logs[0].args.previousOwner, accounts[0]);
    assert.equal(logs[0].args.newOwner, newOwner);
  });

  it("should allow owner to pause and unpause the contract", async () => {
    await token.pause({ from: accounts[0] });
    let paused = await token.paused();
    assert.equal(paused, true);
    await token.unpause({ from: accounts[0] });
    paused = await token.paused();
    assert.equal(paused, false);
  });

  it("should not allow non-owner to pause or unpause the contract", async () => {
    try {
      await token.pause({ from: accounts[1] });
      assert.fail("Pause succeeded even though caller was not owner");
    } catch (err) {
      assert(err.message.includes("revert"), "Expected revert but got " + err);
    }
    try {
      await token.unpause({ from: accounts[1] });
      assert.fail("Unpause succeeded even though caller was not owner");
    } catch (err) {
      assert(err.message.includes("revert"), "Expected revert but got " + err);
    }
  });

  it("should emit Pause and Unpause events when contract is paused and unpaused", async () => {
    const { logs } = await token.pause({ from: accounts[0] });
    assert.equal(logs.length, 1);
    assert.equal(logs[0].event, "Pause");
    assert.equal(logs[0].args.account, accounts[0]);

    const { logs: logs2 } = await token.unpause({ from: accounts[0] });

    assert.equal(logs2.length, 1);
    assert.equal(logs2[0].event, "Unpause");
    assert.equal(logs2[0].args.account, accounts[0]);
  });
});