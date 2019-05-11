import * as vscode from 'vscode';
import Connection from './Connection';
import VariablesBox from '../VariablesBox';

/// Класс необходим для извленчения информации о переменных.
class VariablesConnection extends Connection {

    constructor (address : string, port : number, output : vscode.OutputChannel) {
        super(address, port, output);
    }

    /// Узнаёт у сервера текущее состояние переменных и показывает их.
    showVariables(){
        super.output.appendLine("Trying to set variables connection...");
        var socket = super.initConnection();
        
        var data = "http /web/";

        socket.on('ready', () => {
            super.output.appendLine("Connected successfully.");
            super.output.appendLine("Sending command to robot...");
            socket.write(data);
            console.log(data);
        });
        
        socket.on('data', (receivedData:string) => {
            var jsonPosition = receivedData.indexOf('{');
            var jsonVariablesString = receivedData.substring(jsonPosition);

            var variablesBox = new VariablesBox(jsonVariablesString);
            variablesBox.show(super.output);
            
            socket.end();
        });
    }
}

export default VariablesConnection;