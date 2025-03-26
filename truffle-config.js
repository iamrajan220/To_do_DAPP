module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // Localhost
      port: 7545,         // Ganache port
      network_id: "5777"  // Ganache default Network ID
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};  