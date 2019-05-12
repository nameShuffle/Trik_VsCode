import * as vscode from 'vscode';
import Command from './Command';
import Connection from './Connection';

/**
 * Класс для удобства общения с роботом.
 * Использовуется для подключения к роботу на основе имеющейся конфигурации и отпраки команд.
 */
class TrikConnection extends Connection{

    constructor (address : string, port : number, output : vscode.OutputChannel) {
        super(address, port, output);
    }

    /**
     * Формирование команды на основе переданных данных, отправка команды на сервер.
     * @param commandType -- Тип команды.
     * @param command -- Содержимое команды.
     */
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
            var content = arrayData[arrayData.length - 1];

            this.output.appendLine("Data recieved: " + content);
            socket.end();
        });
    }
}

export default TrikConnection;