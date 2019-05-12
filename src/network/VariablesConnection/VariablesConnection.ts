import * as vscode from 'vscode';
import * as net from 'net';
import Connection from '../Connection';
import VariablesBox from '../../VariablesBox';

/**
 * Класс необходим для извленчения информации о переменных.
 */
class VariablesConnection extends Connection {

    protected variablesCommand : string = "http /web/\n";

    protected variablesBox : VariablesBox;

    constructor (address : string, port : number, output : vscode.OutputChannel, variablesBox : VariablesBox) {
        super(address, port, output);

        this.variablesBox = variablesBox;
    }

    /**
     * Узнаёт у сервера текущее состояние переменных и показывает их.
     */
    updateVariables(variablesBox : VariablesBox) {
        var socket = this.initConnection();

        socket.on('ready', () => {
            socket.write(this.variablesCommand);
        });
        
        socket.on('data', (receivedData) => {
            this.onSocketData(receivedData, socket);
        });
    }

    /**
     * Следующие три функции -- функции-заглушки. При подключении к порту переменных нет смысла сообщать об этом пользователю.
     */
    protected onSocketTimeout = (socket : net.Socket) => {
        socket.end();
    }

    protected onSocketEnd = (socket : net.Socket) => {

    }

    protected onSocketError = (socket : net.Socket) => {

    }

    /**
     * Парсит строку, возвращённую сервером и заносит информацию о переменных в variablesBox.
     */
    protected onSocketData = (receivedData : Buffer, socket : net.Socket) => {
        var data : string;
        data = receivedData.toString();

        var jsonPosition = data.indexOf('{');
        var jsonVariablesString = data.substring(jsonPosition);

        this.variablesBox.setJsonVariablesString(jsonVariablesString);

        socket.end();
    }
}

export default VariablesConnection;