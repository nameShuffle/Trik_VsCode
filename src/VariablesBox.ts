import * as vscode from 'vscode'

/// Класс-контейнер для переменных.
class VariablesBox {

    private jsonVariablesString : string;

    constructor (jsonString : string ) {
        this.jsonVariablesString = jsonString;
    }

    show (output : vscode.OutputChannel){
        let obj = JSON.parse(this.jsonVariablesString);

        for (var key in obj) {
            output.appendLine(obj[key]);
        }
    }
}

export default VariablesBox;