import * as vscode from 'vscode';
import Connection from './network/Connection';

var changeConfiguration : vscode.Disposable;

var currentPort : number;
var currentAddress : string;

// Получение текущей конфигурации из настроек пользователя раздела Trik Robot.
const getConfiguration = () => {
	var trikConfiguration = vscode.workspace.getConfiguration('trik');

	var configuration = {
		port : trikConfiguration.get<number>('port'),
		address : trikConfiguration.get<string>('address')
	}

	return configuration;
}

// Инициализация данных о роботе на основе полученных настроек пользователя.
const initRobotData = () => {
	var configuration = getConfiguration();

	if (configuration.port == undefined)
	{
		console.log("Номер порта не объявлен!");
		return;
	}
	
	if (configuration.address == undefined)
	{
		console.log("Адрес не объявлен!");
		return;
	}

	currentPort = configuration.port;
	currentAddress = configuration.address;
}

// Данных метод вызывается при изменении пользователем настроек конфигурации в разделе TRIK Robot.
const onConfigurationChange = () => {
	var newConfiguration = getConfiguration();

	if (newConfiguration.port != currentPort && newConfiguration.port != undefined)
	{
		currentPort = newConfiguration.port;
	}

	if (newConfiguration.address != currentAddress && newConfiguration.address != undefined)
	{
		currentAddress = newConfiguration.address;
	}
}

// Данный метод вызывается при активации расширения.
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "trikextension" is now active!');

	initRobotData();
	changeConfiguration = vscode.workspace.onDidChangeConfiguration(onConfigurationChange);

	context.subscriptions.push(vscode.commands.registerCommand('extension.sendFileTrik', () => {
		vscode.window.showInformationMessage('Active!');
		var editor = vscode.window.activeTextEditor;
		if (!editor) {
    		return; 
		}

		var text = editor.document.getText();
		var fileName = editor.document.fileName;

		var connection = new Connection (currentAddress, currentPort);
		connection.sendCommand('file', fileName + ':' + text);
	}));
}

// Данный метод вызывается при отключении расширения.
export function deactivate() {
	changeConfiguration.dispose();
}
