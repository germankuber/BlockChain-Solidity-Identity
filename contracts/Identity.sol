//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Identity is Ownable {
    mapping(address => mapping(string => mapping(address => bool)))
        public permissions;

    mapping(address => bool) public usersToOperativeContract;

    function addUserToOperateContract(address _address) public onlyOwner {
        usersToOperativeContract[_address] = true;
    }

    function deleteUserToOperateContract(address _address) public onlyOwner {
        usersToOperativeContract[_address] = false;
    }

    function addPermission(
        address _contractAddress,
        string memory _methodName,
        address _addressToGivePermission
    ) public onlyUsersWithPermissions {
        permissions[_contractAddress][_methodName][
            _addressToGivePermission
        ] = true;
    }

    function deletePermission(
        address _contractAddress,
        string memory _methodName,
        address _addressToRemovePermission
    ) public onlyUsersWithPermissions {
        permissions[_contractAddress][_methodName][
            _addressToRemovePermission
        ] = false;
    }

    function havePermission(
        address _contractAddress,
        string memory _methodName,
        address _addressToCheckPermissions
    ) public view returns (bool) {
        return
            permissions[_contractAddress][_methodName][
                _addressToCheckPermissions
            ];
    }

    modifier onlyUsersWithPermissions() {
        require(
            (msg.sender == owner()) || usersToOperativeContract[msg.sender],
            "Only users with permissions"
        );
        _;
    }
}
