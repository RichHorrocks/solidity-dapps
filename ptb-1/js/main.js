function log(message) {
  $('#log').append($('<p>').text(message));
  $('#log').scrollTop($('#log').prop('scrollHeight'));
}

function error(message) {
  $('#log').append($('<p>').addClass('dark-red').text(message));
  $('#log').scrollTop($('#log').prop('scrollHeight'));
}

function waitForReceipt(hash, cb) {
  web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (err) {
        error(err);
      }

      if (receipt !== null) {
        // Transaction went through
        if (cb) {
          cb(receipt);
        }
      } else {
        // Try again in 1 second
        window.setTimeout(function () {
          waitForReceipt(hash, cb);
        }, 1000);
      }
    });
}

var address = '0xf15090c01bec877a122b567e5552504e5fd22b79';
var abi = [{"constant":true,"inputs":[],"name":"getCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"increment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_count","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

$(function () {
  var counter;

  $('#getcount').click(function (e) {
    e.preventDefault();

    log("Calling getCount...");

    counter.getCount.call(function (err, result) {
      if (err) {
        return error(err);
      } else {
          log("getCount call executed successfully.");
      }

      // The return value is a BigNumber object
      $('#count').text(result.toString());
    });
  });

  $('#increment').click(function (e) {
    e.preventDefault();

    if(web3.eth.defaultAccount === undefined) {
      return error("No accounts found. If you're using MetaMask, " +
                   "please unlock it first and reload the page.");
    }

    log("Calling increment...");

    counter.increment.sendTransaction(function (err, hash) {
      if (err) {
        return error(err);
      }

      waitForReceipt(hash, function () {
        log("Transaction succeeded. " +
            "Call getCount again to see the latest count.");
      });
    });
  });

  if (typeof(web3) === "undefined") {
    error("Unable to find web3. " +
          "Please run MetaMask (or something else that injects web3).");
  } else {
    log("Found injected web3.");
    web3 = new Web3(web3.currentProvider);

    web3.version.getNetwork((err, netId) => {
      switch (netId) {
      case "1":
        console.log('This is mainnet')
        break;
      case "2":
        console.log('This is the deprecated Morden test network.')
        break;
      case "3":
        console.log('This is the ropsten test network.')
        break;
      case "4":
        console.log('This is the Rinkeby test network.')
        break;
      case "42":
        console.log('This is the Kovan test network.')
        break;
      default:
        console.log('This is an unknown network.')
      }
    })

    if (web3.version.network != 3) {
      error("Wrong network detected. Please switch to the Ropsten test network.");
      console.log(web3.currentProvider);
      console.log(web3.version);
    } else {
      log("Connected to the Ropsten test network.");
      counter = web3.eth.contract(abi).at(address);
      $('#getcount').click();
    }
  }
});
