const { expect } = require("chai");

describe("Identity", function () {

  let identity;
  let owner;
  let firstAccount;
  let secondAccount;
  let fakeContractAddress;
  before(async () => {
    identity = await (await ethers.getContractFactory("Identity")).deploy();
    await identity.deployed();

    const accounts = await ethers.getSigners();
    owner = accounts[0];
    firstAccount = accounts[1];
    secondAccount = accounts[2];
    fakeContractAddress = accounts[3];
    identity = await identity.connect(owner);
  });


  it("addUserToOperateContract - Should add a address to the permissions", async function () {
    await identity.addUserToOperateContract(firstAccount.address);
    const result = await identity.usersToOperativeContract(firstAccount.address);
    expect(result).to.equal(true);
  });

  it("deleteUserToOperateContract - Should delete a address to the permissions", async function () {
    await identity.addUserToOperateContract(firstAccount.address);
    await identity.deleteUserToOperateContract(firstAccount.address);
    const result = await identity.usersToOperativeContract(firstAccount.address);
    expect(result).to.equal(false);
  });
  it("addPermission - Should revert the transaction if the address is not a owner", async function () {
    identity = await identity.connect(firstAccount);
    await expect((identity.addPermission(fakeContractAddress.address, "fakeMethod", secondAccount.address))).to.be
      .reverted.revertedWith("Only users with permissions");
  });
  it("addPermission - Should add permission to address", async function () {
    identity = await identity.connect(owner);
    await identity.addPermission(fakeContractAddress.address, "fakeMethod", firstAccount.address);
    const result = await identity.permissions(fakeContractAddress.address, "fakeMethod", firstAccount.address);
    expect(result).to.equal(true);
  });

  it("deletePermission - Should revert the transaction if the address is not a owner", async function () {
    identity = await identity.connect(firstAccount);
    await expect((identity.deletePermission(fakeContractAddress.address, "fakeMethod", secondAccount.address))).to.be
      .reverted.revertedWith("Only users with permissions");
  });

  it("deletePermission - Should add permission to address", async function () {
    identity = await identity.connect(owner);
    await identity.addPermission(fakeContractAddress.address, "fakeMethod", firstAccount.address);
    await identity.deletePermission(fakeContractAddress.address, "fakeMethod", firstAccount.address);
    const result = await identity.permissions(fakeContractAddress.address, "fakeMethod", firstAccount.address);
    expect(result).to.equal(false);
  });

  it("havePermission - Should return true, address has access", async function () {
    identity = await identity.connect(owner);
    await identity.addPermission(fakeContractAddress.address, "fakeMethod", firstAccount.address);
    const result = await identity.havePermission(fakeContractAddress.address, "fakeMethod", firstAccount.address);
    expect(result).to.equal(true);
  });

  it("havePermission - Should return false, address does not have access", async function () {
    identity = await identity.connect(owner);
    await identity.addPermission(fakeContractAddress.address, "fakeMethod", firstAccount.address);
    await identity.deletePermission(fakeContractAddress.address, "fakeMethod", firstAccount.address);
    const result = await identity.havePermission(fakeContractAddress.address, "fakeMethod", firstAccount.address);
    expect(result).to.equal(false);
  });
});
