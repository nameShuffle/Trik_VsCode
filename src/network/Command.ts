/// Класс для удобной работы с командами формата, принимаемого TRIK-роботом.
/// Для создания команды необходимо передать тип команды и ее содержимое.
class Command {
    private type : string;
    private content : string;
    private length : string;

    private commandToSend : string;

    constructor (commandType : string, commandContent : string) {
        this.type = commandType;
        this.content = commandContent;
        this.length = '';
        this.commandToSend = '';

        this.createCommand();
    }

    /// Приватный метод для формирования полноценной команды, готовой к отправке на робота.
    private createCommand() {
        var commandVisoutLength : string;

        if (this.content === '') {
            commandVisoutLength = this.type;
        }
        else {
            commandVisoutLength = this.type + ':'+ this.content;
        }

        this.length = commandVisoutLength.length.toString();
        
        this.commandToSend = this.length + ':' + commandVisoutLength;
    }

    /// Получение длины команды.
    getLength() : string {
        return this.length;
    }

    /// Получение полноценной команды.
    getCommand() : string {
        return this.commandToSend;
    }

    /// Получение типа команды.
    getCommandType() : string {
        return this.type;
    }

    /// Получение содержимого команды.
    getCommandContent() : string {
        return this.content;
    }
}

export default Command;