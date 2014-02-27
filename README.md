# Browser-based Terminal for access to VistA Roll & Scroll applications
 
This repository includes:

- a back-end Node.js module that provides a Web Sockets interface to VistA
- a JavaScript VT-100 Terminal emulation that will run in most browsers.  This is based on 
  [Christopher Jeffrey's term.js emulator] (https://github.com/chjj/term.js/), with modifications
  added to provide Internet Explorer support.


Rob Tweed <rtweed@mgateway.com>  
27 February 2014, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)


## Installing the Node.js module

       npm install ewdvistaterm

## Installing the JavaScript terminal emulator

Copy the two files from the /terminal folder within the ewdvistaterm node_modules directory 
and put them in a directory under your EWD.js web server root path, eg:


       ~/node/www/VistATerm

	   
## Running the Node.js module

In the /examples directory of this repository, you'll find a documented example startup file.  Copy this file to 
the parent directory of your node_modules directory.  Edit it appropriately.  Then run it, eg:

       cd ~/node
       node VistATerm

## Starting the Terminal Emulator in the browser:

       http://mydomain.com:port/VistATerm/term.html

Note: specify the appropriate domain name/IP address and port as configured in ewdVistATermStart.js


## License

 Copyright (c) 2014 M/Gateway Developments Ltd,                           
 Reigate, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
