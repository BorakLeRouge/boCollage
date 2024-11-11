
const vscode = require('vscode');

const { clog } = require('./clog.js') ;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "bocollage" is now active!');

    const panelExt = require('./boColl.js') ;
    const provider = panelExt.boColl(context) ;
    context.subscriptions.push(
		  vscode.window.registerWebviewViewProvider('boCollView', provider)
    );

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
