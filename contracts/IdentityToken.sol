//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract IdentityContractInterface {
    function havePermission(
        address _contractAddress,
        string memory _methodName,
        address _addressToCheckPermissions
    ) public view virtual returns (bool);
}

contract IdentityToken is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    IdentityContractInterface private indentity;

    constructor(address _permissionContract) ERC721("IdentityToken", "IT") {
        indentity = IdentityContractInterface(_permissionContract);
    }

    function mint(address to) public accessToMethod("mint") {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
    }

    modifier accessToMethod(string memory _methodName) {
        require(
            msg.sender == owner() ||
                indentity.havePermission(
                    address(this),
                    _methodName,
                    msg.sender
                ),
            "Only users with permissions"
        );
        _;
    }
}
