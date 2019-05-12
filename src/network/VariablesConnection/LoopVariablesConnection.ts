import * as vscode from 'vscode';
import * as net from 'net';
import VariablesConnection from "./VariablesConnection";
import VariablesBox from "../../VariablesBox";

/**
 * Предназначен для извлечения информации о переменных до тех пор, пока извлечение не остановят вручную.
 */
class LoopVariablesConnection extends VariablesConnection {

    private isLoopActive : boolean = false;

    constructor (address : string, port : number, output : vscode.OutputChannel, variablesBox : VariablesBox) {
        super(address, port, output, variablesBox);
    }

    /**
     * Запускает цикл.
     */
    start() {
        this.isLoopActive = true;

        this.updateVariablesInLoop();
    }

    /**
     * Опрашивает переменные в потоке до тех пор, пока его не остановят.
     */
    private updateVariablesInLoop() {
        if (this.isLoopActive) {
            var socket = this.initConnection();

            socket.on('ready', () => {
                socket.write(this.variablesCommand);
            });
            
            socket.on('data', (receivedData) => {
                this.onSocketData(receivedData, socket);
            });
        }
    }

    /**
     * Останавливает цикл.
     */
    stop() {
        this.isLoopActive = false;
    }

    isActive() : boolean {
        return this.isLoopActive;
    }

    protected onSocketData = (receivedData : Buffer, socket : net.Socket) => {
        super.onSocketData(receivedData, socket);

        this.updateVariablesInLoop();
    }
}

export default LoopVariablesConnection;