import * as vscode from 'vscode';
import TrikConnection from './network/TrikConnection';
import VariablesConnection from './network/VariablesConnection/VariablesConnection';
import VariablesBox from './VariablesBox';

var changeConfiguration : vscode.Disposable;

var currentPort : number;
var currentAddress : string;
var currentVariablesPort : number;
var currendDebugMode : boolean;

var output = vscode.window.createOutputChannel(`TRIK output`);
var variablesBox = new VariablesBox();

/** 
 * Получение текущей конфигурации, указанной пользователем в настройках.
 */ 
const getConfiguration = () => {
	var trikConfiguration = vscode.workspace.getConfiguration('trik');

	var configuration = {
		port : trikConfiguration.get<number>('port'),
		address : trikConfiguration.get<string>('address'),
		variablesPort : trikConfiguration.get<number>('variablesPort'),
		isDebugMode : trikConfiguration.get<boolean>('debugMode')
	};

	return configuration;
};
/**
 * Инициализация данных о роботе на основе настроек пользователя.
 * Сохранение текущего значения адреса и номера порта.
 */
const initRobotData = () => {
	var configuration = getConfiguration();

	if (configuration.port === undefined)
	{
		output.appendLine('The port number is undefined!');
		return;
	}
	
	if (configuration.address === undefined)
	{
		output.appendLine('The address is undefined!');
		return;
	}

	if (configuration.variablesPort === undefined)
	{
		output.appendLine('The variables port is undefined!');
		return;
	}

	if (configuration.isDebugMode === undefined)
	{
		output.appendLine('The debug mode fill is undefined!');
		return;
	}

	currentPort = configuration.port;
	currentAddress = configuration.address;
	currentVariablesPort = configuration.variablesPort;
	currendDebugMode = configuration.isDebugMode;
};

 /**
  * Данные метод вызывается при изменении пользователем данных о роботе в настройках. 
  * Получение нового значения адреса и номера порта и их сохранение.
  */
const onConfigurationChange = () => {
	var newConfiguration = getConfiguration();

	if (newConfiguration.port !== currentPort && newConfiguration.port !== undefined)
	{
		currentPort = newConfiguration.port;
	}

	if (newConfiguration.address !== currentAddress && newConfiguration.address !== undefined)
	{
		currentAddress = newConfiguration.address;
	}

	if (newConfiguration.variablesPort !== currentVariablesPort && newConfiguration.variablesPort !== undefined)
	{
		currentVariablesPort = newConfiguration.variablesPort;
	}

	if (newConfiguration.isDebugMode !== currendDebugMode && newConfiguration.isDebugMode !== undefined)
	{
		currendDebugMode = newConfiguration.isDebugMode;
	}
};

/**
 * Метод для отправки открытого в редакторе файла на робота. 
 * Получение текста и имени открытого файла, формирование необходимой команды и непосредственно отправка команды на робота.
 */
const sendActiveFileToRobot = () => {
	output.appendLine("Sending file to robot:");
	var editor = vscode.window.activeTextEditor;
	if (!editor) {
		return; 
	}

	var text = editor.document.getText();

	var fullName = editor.document.fileName;
	var pathArray = fullName.split("/");
	var fileName = pathArray[pathArray.length - 1];

	var connection = new TrikConnection (currentAddress, currentPort, output);
	connection.sendCommand('file', fileName + ':' + text);
};

/**
 * Запуск открытого в редакторе файла на роботе.
 * Получение текста открытого в редакторе файла, формирование необходимой команды и непосредственно отправка команды на робота.
 */
const runActiveFileOnRobot = () => {
	output.appendLine("Running current program on robot:");
	var editor = vscode.window.activeTextEditor;
	if (!editor) {
		return; 
	}

	var text = editor.document.getText();

	var connection = new TrikConnection(currentAddress, currentPort, output);
	connection.sendCommand('direct', text);
};

/**
 * Запуск файла по имени.
 * Получение имени файла, формирование необходимой команды и непосредственно отправка команды на робота.
 */
const runFileByName = () => {
	// На данный момент метод нигде не используется.
	output.appendLine("Running file by name:");
	var editor = vscode.window.activeTextEditor;
	if (!editor) {
		return; 
	}

	var fullName = editor.document.fileName;
	var pathArray = fullName.split("/");
	var fileName = pathArray[pathArray.length - 1];

	var connection = new TrikConnection(currentAddress, currentPort, output);
	connection.sendCommand('run', fileName);
};

/**
 * Остановка выполения запущенной программы на роботе. 
 * Формирование необходимой команды и непосредственно отправка команды на робота.
 */
const stopExecution = () => {
	output.appendLine("Stopping execution on robot:");
	var connection = new TrikConnection(currentAddress, currentPort, output);
	connection.sendCommand('stop', '');
};

/**
 * Проверка активность робота.
 * Формирование необходимой команды и непосредственно отправка команды на робота.
 */
const isAlive = () => {
	output.appendLine("Checking if robot is alive:");
	var connection = new TrikConnection(currentAddress, currentPort, output);
	connection.sendCommand('keepalive', '');
};
 
/**
 * Показывает текущее значение переменных в исполняющемся на роботе скрипте.
 */
const getVariables = () => {
	output.appendLine("Getting variables...");
	var variablesConnection = new VariablesConnection(currentAddress, currentVariablesPort, output, variablesBox);

	variablesConnection.updateVariables(variablesBox);

	output.appendLine(variablesBox.toString());
};

 /**
  * Данный метод вызывается при активации расширения. Инициализация начальных данных о роботе, регистрация необходимых команд.
  * @param context Конфигурация текущего запуска.
  */
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

	context.subscriptions.push(vscode.commands.registerCommand('extension.isAlive', () => {
		isAlive();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.stopExecution', () => {
		vscode.window.showInformationMessage('Stopping execution!');
		stopExecution();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.getVariables', () => {
		vscode.window.showInformationMessage('Getting variables...');
		getVariables();
	}));
}

 /**
  * Данный метод вызывается при деактивации расширения. 
  */
export function deactivate() {
	changeConfiguration.dispose();
}
