var term = require('ewdvistaterm');

term.start({
  log: true,
  spawnVistA: {
    command: 'ssh',
    arguments: ['-q', 'steve@127.0.0.1', '-tt', '-i', '/home/ubuntu/steve']
  },
  webServer: {
    port: 8081,
    rootPath: '/home/ubuntu/www',
    ssl: true,
    options: {
      key: '/home/ubuntu/ssl/ssl.key',
      cert: '/home/ubuntu/ssl/ssl.crt'
    }
  },
  addLF: false,
  echo: true,
  exitString: 'Logged out at '
});