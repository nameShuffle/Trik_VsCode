import * as vscode from 'vscode';
import Connection from './network/Connection';

var changeConfiguration : vscode.Disposable;

var currentPort : number;
var currentAddress : string;

var output = vscode.window.createOutputChannel(`TRIK output`);

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
		output.appendLine('The port number is undefined!');
		return;
	}
	
	if (configuration.address == undefined)
	{
		console.log("Адрес не объявлен!");
		output.appendLine('The address is undefined!');
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

// Отправка открытого в редакторе файла на робота.
const sendActiveFileToRobot = () => {
	var editor = vscode.window.activeTextEditor;
	if (!editor) {
		return; 
	}

	var text = editor.document.getText();
	var fileName = editor.document.fileName;

	var connection = new Connection (currentAddress, currentPort, output);
	connection.sendCommand('file', fileName + ':' + text);
}

// Запуск открытого в редакторе файла на роботе.
const runActiveFileOnRobot = () => {
	var editor = vscode.window.activeTextEditor;
	if (!editor) {
		return; 
	}

	var text = editor.document.getText();

	var connection = new Connection (currentAddress, currentPort, output);
	connection.sendCommand('run', text);
}

// Данный метод вызывается при активации расширения.
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "trikextension" is now active!');

	initRobotData();
	changeConfiguration = vscode.workspace.onDidChangeConfiguration(onConfigurationChange);

	output.show(true);

	context.subscriptions.push(vscode.commands.registerCommand('extension.sendFileTrik', () => {
		vscode.window.showInformationMessage('Sending begins!');
		sendActiveFileToRobot();
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.runFileTrik', () => {
		vscode.window.showInformationMessage('Running begins!');
		runActiveFileOnRobot();
	}));
}

// Данный метод вызывается при отключении расширения.
export function deactivate() {
	changeConfiguration.dispose();
}
