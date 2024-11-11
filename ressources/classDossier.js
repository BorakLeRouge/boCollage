const  path = require('path') ;
const  fs   = require('fs') ;
const { clog } = require('./clog.js') ;

exports.DossierBoCollage = class DossierBoCollage {
    constructor(dossier, niveau) {
        this.dossier = dossier ;
        if (dossier != undefined && dossier != '') {
            this.nom     = path.basename(this.dossier) ;
            this.niveau  = niveau ;
            let lectC = this.lectureContenu() ;
            if (lectC != undefined) {
                this.contenu     = lectC.contenu ;
                this.liste       = lectC.liste ;
                this.contenu.sort() ;
                this.liste.sort() ;
                this.typeDossier = lectC.typeDossier ;
            }
        }
    }

    get recupHTML() {
        if (this.typeDossier) {
            return { html: this.recupHTMLDossier(), cible: 'contenu' + this.niveau }
        } else {
            return { html: this.recupHTMLFichier(), cible: 'contenu' + this.niveau }
        }
    }

    // Fonction interne
    lectureContenu() {
        if (fs.existsSync(this.dossier) && fs.lstatSync(this.dossier).isDirectory()) {
            // Lecture du contenu
            let dir = fs.readdirSync(this.dossier) ;
            let nomFic   = [] ;
            let fichiers = [] ;
            let nomDoss  = [] ;
            let dossiers = [] ;
            for(let n of dir) {
                let f = path.join(this.dossier, n)
                if (f.substring(0, 1) != '.') {
                    if (fs.lstatSync(f).isDirectory()) {
                        nomDoss.push(n) ;
                        dossiers.push(f) ;
                    } else {
                        let nm = path.basename(n, path.extname(n))
                        nomFic.push(nm) ;
                        fichiers.push(f) ;
                    }
                }
            }
            if (dossiers.length > 0) {
                return { contenu: dossiers, liste: nomDoss, typeDossier: true } ;
            } else {
                return { contenu: fichiers, liste: nomFic,  typeDossier: false } ;
            }
        }
        return undefined ;
    }

    recupHTMLDossier() {
        let html = '<select id="select'+this.niveau+'" onchange="ouvrDoss(this.value, '+(this.niveau + 1)+', \'contenu'+(this.niveau + 1)+'\')">' + "\r\n" ;
        for (let i in this.liste) {
            html += '<option value="'+this.contenu[i]+'">' + this.liste[i] + '</option>' + "\r\n" ;
        }
        html += '</select><br />' + "\r\n" ;
        html += '<div id="contenu'+(this.niveau + 1)+'"></div>' ;
        return html ;
    }

    recupHTMLFichier() {
        let html = '<br />' ;
        for (let i in this.liste) {
            html += '<span onclick="ouvrFich(\''+this.contenu[i]+'\')" class="lien">' + this.liste[i] + '</span><br />' + "\r\n" ;
        }
        return html ;
    }

}
 



