const { WebSocketServer } = require('ws');


//import WebSocketService from '/js/ws.js';
const wsConnection = require('./wsConnection.js');


class wsServer {

    lastUserId = 1; // last user (id) 
    wsConnections = { connections: [] }; //list of objects representing connections
    constructor(httpServer) {
        this.wss = new WebSocketServer({ server: httpServer }); // websocket server does most of the heavy lifting

        this.wss.on('connection', (ws) => { // new websocket connection
            let conn = new wsConnection(ws, this, this.lastUserId++); // object to handle connection
            this.wsConnections.connections.push(conn); //lab 5
            conn.sendMessage("hello from server");
        });
    }

    //lab 5
    clientDisconnected = function (sender) {
        const posConn = this.wsConnections.connections.indexOf(sender);
        this.wsConnections.connections.splice(posConn, 1);
        this.broadcastMessage(sender, 'disconnected');
    }
//lab 5
    broadcastMessage = function (sender, msg) {
        for (const wsc of this.wsConnections.connections) {
            if (wsc.userId != sender.userId) {
                wsc.sendMessage(`${msg}`, sender);
            }
        }
    }
}

module.exports = wsServer;