pragma solidity ^0.4.17;

contract TipJar {

    // Current owner of the contract.
    address owner;

    modifier ownerOnly {
        require(owner == msg.sender);
        _;
    }

    // Contract's constructor function.
    function TipJar() public {
        owner = msg.sender;
    }

    function withdraw() public ownerOnly {
        msg.sender.transfer(address(this).balance);
    }

    function deposit(uint256 amount) payable public {
        // If require fails, the transaction fails, and there are no side-effects.
        require(msg.value == amount);
        // Any sent ETH is implicitly transferred to the contract.
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Only the current owner can change to a new owner.
    function changeOwner(address newOwner) public ownerOnly {
        owner = newOwner;
    }
}
