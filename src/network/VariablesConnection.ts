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
        this.output.appendLine("Trying to set variables connection...");
        var socket = this.initConnection();
        
        var data = "http /web/\n";

        socket.on('ready', () => {
            this.output.appendLine("Connected successfully.");
            this.output.appendLine("Sending command to robot...");
            socket.write(data);
            console.log(data);
        });
        
        socket.on('data', (receivedData) => {
            var data : string;
            data = receivedData.toString();

            var jsonPosition = data.indexOf('{');
            var jsonVariablesString = data.substring(jsonPosition);

            var variablesBox = new VariablesBox(jsonVariablesString);
            variablesBox.show(this.output);
            
            socket.end();
        });
    }
}

export default VariablesConnection;