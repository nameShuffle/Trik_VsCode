import * as vscode from 'vscode';
import Command from './Command';
import Connection from './Connection';

/// Класс для удобства общения с роботом.
/// Использовуется для подключения к роботу на основе имеющейся конфигурации и отпраки команд.
class TrikConnection extends Connection{

    constructor (address : string, port : number, output : vscode.OutputChannel) {
        super(address, port, output);
    }

    /// Формирование команды на основе переданных данных, отправка команды на сервер.
    sendCommand (commandType : string, command : string) {
        super.output.appendLine("Trying to connect...");
        var socket = super.initConnection();

        var newCommand = new Command(commandType, command);

        socket.on('ready', () => {
            super.output.appendLine("Connected successfully.");
            super.output.appendLine("Sending command to robot...");
            socket.write(newCommand.getCommand());
            console.log(newCommand.getCommand());
        });
        
        socket.on('data', (data) => {
            var arrayData = data.toString().split(':');
            var content = arrayData[arrayData.length - 1];

            super.output.appendLine("Data recieved: " + content);
            socket.end();
        });
    }
}

export default TrikConnection;