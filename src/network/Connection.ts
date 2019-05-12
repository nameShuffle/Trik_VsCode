import * as vscode from 'vscode';
import * as net from 'net';

/// Класс для общения с другими устройствами.
class Connection {
    protected port : number;
    protected address : string;

    protected output : vscode.OutputChannel;

    constructor (address : string, port : number, output : vscode.OutputChannel) {
        this.address = address; 
        this.port = port;

        this.output = output;
    }

    /**
     * Метод для инициализации соединения.
     */
    protected initConnection() : net.Socket {
        var socket = net.createConnection({ port: this.port, host: this.address });
        
        socket.setTimeout(3000);
        socket.on('timeout', () => {
            this.onSocketTimeout(socket);
        });

        socket.on('error', () => {
            this.onSocketError(socket);
        });

        socket.on('end', () => {
            this.onSocketEnd(socket);
        });

        return socket;
    }

    /**
     * Отправка данных на сервер по указанному адресу.
     * @param data -- Данные, которые отправляет данный метод серверу.
     */
    public send(data : string) {
        this.output.appendLine("Trying to connect...");
        var socket = this.initConnection();

        socket.on('ready', () => {
            this.output.appendLine("Connected successfully.");
            socket.write(data);
        });
        
        socket.on('data', (receivedData) => {
            this.output.appendLine("Data recieved: " + receivedData);

            socket.end();
        });
    }

    setAddress(address : string) {
        this.address = address;
    }

    setPort(port : number) {
        this.port = port;
    }

    getAddress() : string {
        return this.address;
    }
    
    getPort() : number {
        return this.port;
    }

    /**
     * Callback-функции, которые внедряются в socket.on.
     */
    protected onSocketTimeout = (socket : net.Socket) => {
        this.output.appendLine("Socket timeout");

        socket.end();
    }

    protected onSocketError = (socket : net.Socket) => {
        this.output.appendLine('Something bad happened. Please try again!');
        this.output.appendLine("");
    }

    protected onSocketEnd = (socket : net.Socket) => {
        this.output.appendLine("Disconnected.");
        this.output.appendLine("");
    }
}

export default Connection;