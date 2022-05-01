const url = 'http://localhost:3000/admin';
const io = require("socket.io-client");
const socket = io.connect( url, { reconnection: true } );

socket.on( 'Admin', (msg)=> {
    console.log='Received',msg ;
});