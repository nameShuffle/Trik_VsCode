import * as vscode from 'vscode';
import * as net from 'net';

class Connection {
    private port : number;
    private address : string;

    private output : vscode.OutputChannel;

    constructor (address : string, port : number, output : vscode.OutputChannel) {
        this.address = address; 
        this.port = port;

        this.output = output;
    }

    private initConnection() : net.Socket {
        var socket = net.createConnection({port: this.port, host: this.address});
        
        socket.setTimeout(3000);
        socket.on('timeout', () => {
            console.log('Socket timeout.');
            this.output.appendLine('Socket timeout.');
            socket.end();
        });

        socket.on('error', () => {
            console.log("Something bad happened. Please try again!");
            this.output.appendLine('Something bad happened. Please try again!');
        });

        socket.on('end', () => {
            console.log("Disconnected from server.");
            this.output.appendLine("Disconnected from server.");
        });

        return socket;
    }

    sendCommand (commandType : string, command : string) {
        console.log("Trying to connect...");
        this.output.appendLine("Trying to connect...");
        var socket = this.initConnection();

        var commandToSend : string;
        if (command == "") {
            commandToSend = commandType;
        }
        else {
            commandToSend = commandType + ":" + command;
        }
        
        commandToSend = commandToSend.length.toString() + ':' + commandToSend;

        socket.on('ready', () => {
            console.log("Connected successfully. Ready to send data.");
            this.output.appendLine("Connected successfully. Ready to send data.");
            console.log("Trying to send command to robot...");
            this.output.appendLine("Trying to send command to robot...");
            socket.write(commandToSend);
        });
        
        socket.on('data', (data) =>{
            console.log("Data recieved: " + data.toString());
            this.output.appendLine("Data recieved: " + data.toString());
            socket.end();
        });
    }

    setAddress (address : string) {
        this.address = address;
    }

    setPort (port : number) {
        this.port = port;
    }
}

export default Connection;