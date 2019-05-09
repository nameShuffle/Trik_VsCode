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

    /// Метод для инициализации соединения - создание сокета.
    protected initConnection() : net.Socket {
        var socket = net.createConnection({ port: this.port, host: this.address });
        
        socket.setTimeout(30000);
        socket.on('timeout', () => {
            this.output.appendLine('Socket timeout.');
            socket.end();
        });

        socket.on('error', () => {
            this.output.appendLine('Something bad happened. Please try again!');
            this.output.appendLine("");
        });

        socket.on('end', () => {
            this.output.appendLine("Disconnected.");
            this.output.appendLine("");
        });

        return socket;
    }

    /// отправка данных на сервер по указанному адресу.
    public send(data : string) {
        this.output.appendLine("Trying to connect...");
        var socket = this.initConnection();

        socket.on('ready', () => {
            this.output.appendLine("Connected successfully.");
            socket.write(data);
        });
        
        socket.on('data', (recievedData) => {
            this.output.appendLine("Data recieved: " + recievedData);
            socket.end();
        });
    }

     /// Сохранение нового адреса.
     setAddress(address : string) {
        this.address = address;
    }

    /// Сохранение нового номера порта.
    setPort(port : number) {
        this.port = port;
    }

    /// Получение текущего адреса.
    getAddress() : string {
        return this.address;
    }

    /// Получение текущего номера порта.
    getPort() : number {
        return this.port;
    }
}

export default Connection;