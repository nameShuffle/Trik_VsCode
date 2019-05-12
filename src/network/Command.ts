/**
 * Класс для удобной работы с командами формата, принимаемого TRI>K-роботом.
 * Для создания команды необходимо передать тип команды и ее содержимое.
 */
class Command {
    private type : string;
    private content : string;
    private length : number;

    private commandToSend : string;

    constructor (commandType : string, commandContent : string) {
        this.type = commandType;
        this.content = commandContent;
        this.length = 0;
        this.commandToSend = '';

        this.createCommand();
    }

    /**
     * Приватный метод для формирования полноценной команды, готовой к отправке на робота.
     */
    private createCommand() {
        var commandWithoutLength : string;

        if (this.content === '') {
            commandWithoutLength = this.type;
        }
        else {
            commandWithoutLength = this.type + ":" + this.content;
        }

        this.length = commandWithoutLength.length;
        
        this.commandToSend = this.length + ":" + commandWithoutLength;
    }

    getLength() : number {
        return this.length;
    }

    getCommand() : string {
        return this.commandToSend;
    }

    getCommandType() : string {
        return this.type;
    }

    getCommandContent() : string {
        return this.content;
    }
}

export default Command;