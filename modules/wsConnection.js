const dateFns = require('date-fns');


class wsConnection {

    connection = null;
    server = null;
    userId = null;
    constructor(connection, server, userId) {
        this.connection = connection;
        this.server = server;
        this.userId = userId;
        connection.on('error', () => console.log("connection error"));
        server.broadcastMessage(this, 'connected');

        connection.on('message', (data) => {
            const dataMsg = JSON.parse(data);
            if (dataMsg.type == "message" && dataMsg.data != null) {
                server.broadcastMessage(this, dataMsg.data); // send to all other connections
            }
        });

        connection.on('close', () => {
            console.log("a client disconnected!");
            server.clientDisconnected(this);
        });
    }

    sendMessage(msg, sender) {
        const dataMsg = { type: "message", data: msg, sender: sender != null ? sender.userId : null, time: dateFns.formatISO(new Date()) };
        this.connection.send(JSON.stringify(dataMsg)); // send message to this specific client (on this connection)
    }

}

module.exports = wsConnection;

// type
// data
// { type: "message", data: "text"}