var https = require('https')
  , url = require('url')
  , fs = require('fs')
  , io = require('/opt/node/node_modules/ewdgateway2/node_modules/socket.io')
  , sys = require('sys')
  , spawn = require('child_process').spawn
  , server;

var path = require("path"); 

var webServer = {
   rootPath: "/opt/node/www",
   port:     8082
};

var dump = function(dataStr) {
  var result = '';
  if (EWD.log) console.log("================\r\n" + dataStr + "\r\n");
  for (var i=0; i<dataStr.length; i++) result = result + ":" + dataStr.charCodeAt(i);
  if (EWD.log) console.log("=================\r\n" + result + "\r\n=================\r\n");
};

var childProcess = {   
   connectionType: 'telnet',
   ipAddress:      '10.239.27.221'
};

var options = {
  key: fs.readFileSync('/opt/node/ssl/myserver.key'),
  cert: fs.readFileSync('/opt/node/ssl/voesolutions.crt')
};
server = https.createServer(options, function(req, res){
  var uri = url.parse(req.url).pathname;
  console.log("incoming url from " + req.connection.remoteAddress +": " + uri);
  switch (uri){
    case '/':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<h1>Welcome. Try the <a href="/chat.html">chat</a> example.</h1>');
      res.end();
      break;
      
    case '/json.jsx':
    case '/jsTerm.htmlx':
    case '/testVT.htmlx':
      fs.readFile(__dirname + uri, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': uri == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
      
    default: 

       var fileName = webServer.rootPath + uri;
       if (EWD.log) console.log("testing " + fileName);
       fs.exists(fileName, function(exists) {  
         if(!exists) {
            if (EWD.log) console.log(fileName + " not found");
            res.writeHead(404, {"Content-Type": "text/plain"});  
            res.write("404 Not Found\n");  
            res.end();  
            return;  
         }  
         fs.readFile(fileName, "binary", function(err, file) {  
            if(err) {  
                res.writeHead(500, {"Content-Type": "text/plain"});  
                res.write(err + "\n");  
                res.end();  
                return;  
            }
            contentType = "text/plain";
            if (EWD.log) console.log("fileName = " + fileName);
            if (fileName.indexOf(".js") !== -1) contentType = "application/javascript";
            if (fileName.indexOf(".css") !== -1) contentType = "text/css";
            if (fileName.indexOf(".jpg") !== -1) contentType = "image/jpeg";
            if (fileName.indexOf(".html") !== -1) contentType = "text/html";
            res.writeHead(200, {"Content-Type": contentType});  
            res.write(file, "binary");  
            res.end();  
         });  
       }); 

  }
}),

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};

sendBlocked = function(res) {
  send404WithMessage(res, 'You have been blocked.  Contact me if you want to be re-enabled');
};

send404WithMessage = function(res,message){
  res.writeHead(404);
  res.write(message);
  res.end();
};

server.listen(webServer.port);
var io = io.listen(server);

var dataBuffer = '';
var finished = false;
var received = '';

io.set('log level', 0);
io.sockets.on('connection', function(client){
  if (EWD.log) console.log("connection event");
  client.connected = true;
  var addLF = false;
  //var addLF = true;
  var sending = false;
  var browserReady = true;
  var page = '';
  var outputBuffer = [];
  var m;
  if (client.handshake) console.log("incoming socket connection from " + JSON.stringify(client.handshake.address));
  switch (childProcess.connectionType) {
     case 'telnet':
        //var m = spawn('csession',['cache','-U','vista','^XUS']);
        //var m = spawn('mumps',['-run','^XUS']);
        //var m = spawn('mumps',['-dir']);
        var m = spawn('sshpass',['-p', 'vistaewd', 'ssh', '-o', 'StrictHostKeyChecking=no', 'vista@127.0.0.1', '-tt']);
        break;
  }

  m.isRunning = true;
  m.stdin.setEncoding = 'utf-8';
  m.echo = true;

  var sendFromBuffer = function() {
     if (!browserReady) return;
     if (EWD.log) console.log("start sendFromBuffer");
     sending = true;
     var chunk;
     var totalChars = 0;
     sending = true;
     if ((outputBuffer.length > 0) && (totalChars < 500)) {
        chunk = outputBuffer.splice(0,1);
        if (EWD.log) console.log("chunk length = " + chunk.toString().length);
        totalChars = totalChars + chunk.toString().length;
        //browserReady = false;
        if (EWD.log) console.log("**** chunk = " + chunk.toString());
        if (EWD.log) console.log("**** typeof chunk = " + typeof(chunk));
        //client.json.send(chunk);
        client.emit('data', chunk);
        if (EWD.log) console.log("sent to browser; totalChars = " + totalChars);
     }
     //sending = false;
     m.error = false;
     if (EWD.log) console.log("end sendFromBuffer");
  };

  /*
  setInterval(function() {
     if (!sending) sendFromBuffer();
  },10000);
  */
  m.error = false;

  m.stderr.on('data', function(data) {
    m.error = true;
    var escData = data.toString();
    if (EWD.log) console.log('Error: ' + data);
    escData = '\n' + escData.replace(/\033\13322m/g, '');
    outputBuffer.unshift(escData);
    sendFromBuffer();
  });

  m.stdout.on('data', function (data) {
     var escData = data.toString();
     if (EWD.log) console.log('from M: ' + escData);
     //console.log("from M: " + escData.replace(/\033/g, "(esc)"));
     //escData = escData.replace(/\033\052\074/g, '');
     //escData = escData.replace(/\033\051\060/g, '');
     escData = escData.replace(/\033\13322m/g, '');
     outputBuffer.push(escData);
     if (!m.error) {
       setTimeout(function() {
         sendFromBuffer();
       },1);
     }
     //client.send(escData);
     if (escData.indexOf("[5i") !== -1) {
       addLF = false;
     }
     if (escData.indexOf("[c") !== -1) {
       //addLF = true;
     }
  });

   m.on("exit",function(code,signal) {
     console.log(client.sessionId + ": back-end routine has exited");
      m.isRunning = false;
      //if (client.connected) client.json.send({exit: client.sessionId});
      if (client.connected) client.json.send({exit: 1});
   });

  client.on('data', function(message){
    //console.log("message received from browser: type = " + typeof(message) + ": ");
    if (EWD.log) console.log('from browser: ' + JSON.stringify(message));
    if (typeof message === 'object') {
      if ("code" in message) {
        if (EWD.log) console.log("code = " + message.code);
        message = String.fromCharCode(message.code)
      }
    }
    dump(message);   

    if (message === '{ok:true}') {
       if (EWD.log) console.log("ack from browser");
       browserReady = true;
       if (!sending) sendFromBuffer();
       return;
    }

    if (m.isRunning) {
       if (message === '\r') {
         if (EWD.log) console.log('CR received - addLF = ' + addLF);
         if (addLF) {
           message = '\r\n';
           if (EWD.log) console.log('CRLF sent to M');
         }
         else {
           if (EWD.log) console.log('CR sent to M');
         }
       }
       m.stdin.write(message);
    }
    else {
       //m.stdin.write(message);
       client.send("Back-end routine has terminated");
       client.json.send({exit: 1});
    }
  });

  client.on('disconnect', function(){
    //client.send({ announcement: client.sessionId + ' disconnected' });
    console.log("Client disconnected - sending kill to child process");
    if (m.isRunning) {
       m.kill();
       m.isRunning = false;
    }
    client.connected = false;
  });


});

var EWD = {
  log: true
};


