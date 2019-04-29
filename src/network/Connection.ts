import * as io from 'socket.io-client';

class Connection {
    private port : number;
    private address : string;

    constructor (address : string, port : number) {
        this.address = address; 
        this.port = port;
    }

    private initConnection() {
        var socket = io.connect('http://' + this.address, { autoConnect : false, port: this.port.toString() });
        
        socket.on('connect_error)', (error : Error) => {
            console.log("Connection failed.")
        });
        socket.on('connect_timeout', () => {
            console.log("Connection failed.")            
        });
        socket.on('connect', () => {
            console.log("Connected successfully.")
        });
        socket.on('error', () => {
            console.log("Something bad happened. Please try again!");
        });

        socket.open();

        return socket;
    }

    sendCommand (commandType : string, command : string) {
        console.log("Trying to connect...");
        var socket = this.initConnection();

        var commandToSend : string;
        if (command == "") {
            commandToSend = commandType;
        }
        else {
            commandToSend = commandType + ":" + command;
        }

        console.log("Trying to send commond to robot...")
        socket.send(commandToSend);

        socket.close();
        console.log("Finished.");
    }
}

export default Connection;