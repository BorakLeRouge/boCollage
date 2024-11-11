// Besoin par defaut.
const vscode = require('vscode') ;
const fs     = require('fs') ;
const path   = require('path') ;
 
const { clog } = require('./clog.js') ;

const configuration  = vscode.workspace.getConfiguration('boCollage') ;
let dossierDeStockage = configuration.dossierDeStockage ;

const { DossierBoCollage } = require('./classDossier') ; 
let dossBoColl = []

// =================================================
//   W   W  EEEEE  BBBB   V   V  III  EEEEE  W   W
//   W   W  E      B   B  V   V   I   E      W   W
//   W W W  EEEE   BBBB   V   V   I   EEEE   W W W
//   W W W  E      B   B   V V    I   E      W W W
//    W W   EEEEE  BBBB     V    III  EEEEE   W W
// =================================================
// * * * WebView

const boColl = function(context) {

    class ZeWebViewPanel {
        constructor(_extensionUri) {
            this._extensionUri  = _extensionUri ;
        }
        resolveWebviewView(webviewView, context, _token) {
            this._view = webviewView;
            webviewView.webview.options = {
                // Allow scripts in the webview
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    this._extensionUri
                ]
            };
            webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
            webviewView.webview.onDidReceiveMessage(msg => {
                if (msg.action == 'Affichage') {
                    affichage(webviewView.webview, msg) ;
                }
                if (msg.action == 'Ouvrir Fichier') {
                    if (fs.existsSync(msg.fichier)) {
                        let uri = vscode.Uri.file(msg.fichier) ;
                        vscode.commands.executeCommand('vscode.open', uri) ;
                    } else {
                        vscode.window.showErrorMessage("Le fichier n'est plus présent") ;
                    }
                }
            });
        }
        _getHtmlForWebview(webview) {
            let fichHTML = path.join(context.extensionPath, 'ressources', 'page.html') ;
            let contenuHTML = fs.readFileSync(fichHTML).toString() ;
            const CHEMIN = webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'ressources'))) ;
            contenuHTML = contenuHTML.replaceAll('<chemin/>', CHEMIN) ;  
            return contenuHTML;
        }

    }
    ZeWebViewPanel.viewType = 'boCollView';
 
    const lePanel = new ZeWebViewPanel(context.extensionUri, context.extensionPath);

    return lePanel ;
}



// =============================================================================================================
//  PPPP   RRRR   EEEEE  PPPP     A    RRRR          A    FFFFF  FFFFF  III   CCC   H   H    A     GGG   EEEEE
//  P   P  R   R  E      P   P   A A   R   R        A A   F      F       I   C   C  H   H   A A   G   G  E
//  P   P  R   R  EEE    P   P  A   A  R   R       A   A  FFF    FFF     I   C      HHHHH  A   A  G      EEE
//  PPPP   RRRR   E      PPPP   AAAAA  RRRR        AAAAA  F      F       I   C      H   H  AAAAA  G  GG  E
//  P      R  R   E      P      A   A  R  R        A   A  F      F       I   C   C  H   H  A   A  G   G  E
//  P      R   R  EEEEE  P      A   A  R   R       A   A  F      F      III   CCC   H   H  A   A   GGGG  EEEEE
// =============================================================================================================
// * * * preparation de l'affichage
async function PreparationAffichage(context, webview, dossierInit = '') {
    return '' ;
}



// ================================================
//    A     CCC   TTTTT  III   OOO   N   N   SSS
//   A A   C   C    T     I   O   O  NN  N  S
//  A   A  C        T     I   O   O  N N N   SSS
//  AAAAA  C        T     I   O   O  N  NN      S
//  A   A  C   C    T     I   O   O  N   N      S
//  A   A   CCC     T    III   OOO   N   N  SSSS
// ================================================
// * * * Actions à traiter
function affichage(webview, msg) {
    if(msg.action == 'Affichage') {
        // Lecture du fichier
        if (msg.pos == 0) {
            msg.fichier = dossierDeStockage ;
        }
        dossBoColl[msg.pos] = new DossierBoCollage(msg.fichier, msg.pos) ;
        if (dossBoColl[msg.pos].contenu != undefined) {
            // PreparationAffichage(context, webviewView.webview) ;
            let prep = dossBoColl[msg.pos].recupHTML ;
            webview.postMessage({
                action: 'affichage',
                html:    prep.html,
                cible:   prep.cible,
                pos:     msg.pos,
                suivant: dossBoColl[msg.pos].contenu[0]
            })
        }
    }
}


module.exports = {
	boColl
}

// =======================================================
//  RRRR    OOO   U   U  TTTTT  III  N   N  EEEEE   SSS
//  R   R  O   O  U   U    T     I   NN  N  E      S
//  R   R  O   O  U   U    T     I   N N N  EEE     SSS
//  RRRR   O   O  U   U    T     I   N  NN  E          S
//  R  R   O   O  U   U    T     I   N   N  E          S
//  R   R   OOO    UUU     T    III  N   N  EEEEE  SSSS
// =======================================================
// * * * Routines
