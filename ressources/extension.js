
const vscode = require('vscode') ;
const path = require('path') ;
const fs   = require('fs') ;

const outputMngr = require('./outputMngr.js') ;

const { clog } = require('./clog.js') ;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable ;
    outputMngr.setContext(context) ;

    // * * * Test une fois par jour * * *
    let lastDate    = context.globalState.get('bocollage-date') ;
    let newDate = new Date ; 
    let currentDate = newDate.getDate() + '-' + newDate.getMonth() ;
    if (currentDate != lastDate) {
        outputMngr.affich('1er raff du jour.')
        raffraichirDepot() ;
        context.globalState.update('bocollage-date', currentDate) ;
    }

    // * * * Mise en place du panel * * *
    const panelExt = require('./boColl.js') ;
    const provider = panelExt.boColl(context) ;
    context.subscriptions.push(
		  vscode.window.registerWebviewViewProvider('boCollView', provider)
    );

    // * * * Commande de Rafr du dépot * * *
	disposable = vscode.commands.registerCommand('boCollage.raffraichirDepot', async function () {
		raffraichirDepot() ;
	});
	context.subscriptions.push(disposable);

    // * * * Ouvrir le dossier dans vscode * * *
	disposable = vscode.commands.registerCommand('boCollage.ouvrirDossier', async function () {
        const configuration  = vscode.workspace.getConfiguration('boCollage') ;
        let leDossier = configuration.dossierDeStockage ;
        let leFich    = path.join(leDossier) ;
        if (leDossier != undefined && leDossier.trim() != '' && fs.existsSync(leFich)) {
            let uri = vscode.Uri.file(leFich) ;
            vscode.commands.executeCommand('vscode.openFolder', uri, {forceNewWindow: true}) ;
        }
	});
	context.subscriptions.push(disposable);

}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

// Rafraichir le dépot paramètre si c'est du git
async function raffraichirDepot() {
    const configuration  = vscode.workspace.getConfiguration('boCollage') ;
    let dossierDeStockage = configuration.dossierDeStockage ;
    // let pointGit = path.join(dossierDeStockage, '.git') ; // test
    let pointGit = path.join(dossierDeStockage, '.git') ;
    outputMngr.affich('dossier de stockage : '+dossierDeStockage)
    if (fs.existsSync(pointGit)) {
        let   cmd       = 'git pull' ;
        try {
            outputMngr.affich('Git pull') ;
            let cmdResult = require('child_process').execSync(
                    cmd, { cwd:      dossierDeStockage
                         , encoding: 'utf8' }
            ).toString() ;
        } catch(err) {
            outputMngr.affich('Git pull Ano : ' + err.toString()) ;
        }
    }
}

