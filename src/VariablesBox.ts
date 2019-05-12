import * as vscode from 'vscode';

/**
 * Класс-контейнер для переменных.
 */
class VariablesBox {

    private jsonVariablesString : string = "default";

    /**
     * Показывает переменные через заданный стрим.
     * @param output Заданный выходной стрим.
     */
    toString () : string {
        let resultString : string = "";

        let obj = JSON.parse(this.jsonVariablesString);

        for (var key in obj) {
            resultString += key.toString() + ": " + obj[key] + "\n";
        }

        return resultString;
    }

    setJsonVariablesString(jsonVariablesString : string) {
        this.jsonVariablesString = jsonVariablesString;
    }
}

export default VariablesBox;