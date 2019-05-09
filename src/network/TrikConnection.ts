import * as vscode from 'vscode';
import * as net from 'net';
import Command from './Command';

/// Класс для удобства общения с роботом.
/// Использовуется для подключения к роботу на основе имеющейся конфигурации и отпраки команд.
class TrikConnection {
    private port : number;
    private address : string;

    private output : vscode.OutputChannel;

    constructor (address : string, port : number, output : vscode.OutputChannel) {
        this.address = address; 
        this.port = port;

        this.output = output;
    }

    /// Метод для инициализации соединения - создание сокета для общения с роботом.
    private initConnection() : net.Socket {
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
            this.output.appendLine("Disconnected from robot.");
            this.output.appendLine("");
        });

        return socket;
    }

    /// Формирование команды на основе переданных данных, отправка команды на сервер.
    sendCommand (commandType : string, command : string) {
        this.output.appendLine("Trying to connect...");
        var socket = this.initConnection();

        var newCommand = new Command(commandType, command);

        socket.on('ready', () => {
            this.output.appendLine("Connected successfully.");
            this.output.appendLine("Sending command to robot...");
            socket.write(newCommand.getCommand());
            console.log(newCommand.getCommand());
        });
        
        socket.on('data', (data) => {
            var arrayData = data.toString().split(':');
            var content = arrayData[arrayData.length - 1]

            this.output.appendLine("Data recieved: " + content);
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

export default TrikConnection;