var term = require('ewdvistaterm');

term.start({
  log: true,
  spawnVistA: { // how to start a back-end terminal connection/process
    command: 'ssh', 
    arguments: ['-q', 'steve@127.0.0.1', '-tt', '-i', '/home/ubuntu/steve']

    // this example is the equivalent of ssh -q 'steve@127.0.0.1 -tt -i '/home/ubuntu/steve'
    //  note: -tt is needed to force tty allocation
    //  in the example above I'm using an authentication key
    //  if you need to use a password, install sshpass instead and this as an example:
    //     command: 'sshpass',
    //     arguments: ['-p', 'vistaewd', 'ssh', '-o', 'StrictHostKeyChecking=no', 'vista@127.0.0.1', '-tt']

  },
  webServer: {
    port: 8081,  // port on which web server will listen
    rootPath: '/home/ubuntu/www',   // physical path that represents the web server's root path
    ssl: true,  
    options: {
      key: '/home/ubuntu/ssl/ssl.key',
      cert: '/home/ubuntu/ssl/ssl.crt'
    }
  },
  addLF: false,  // for Linux systems, this should be false
  echo: true,    // for Linux systems, this should be true
  exitString: 'Logged out at '  // string that tells the terminal to no longer communicate with the back end
});