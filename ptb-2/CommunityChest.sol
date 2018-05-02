pragma solidity ^0.4.17;

contract CommunityChest {
    function withdraw() public {
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
}
