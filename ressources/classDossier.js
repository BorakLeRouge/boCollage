const  path = require('path') ;
const  fs   = require('fs') ;
const { clog } = require('./clog.js') ;

exports.DossierBoCollage = class DossierBoCollage {
    constructor(dossier, niveau) {
        this.dossier = dossier ;
        this.niveau  = niveau ;
        this.nom = '' ;
        this.contenu = [] ;
        if (dossier != undefined && dossier != '') {
            this.nom     = path.basename(this.dossier) ;
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

    set setPosition(position) {
        this.position = position ;
    }

    get getHTML() {
        if (this.niveau == 0 && this.nom == '') {
            return { 
                html: '<p>Dossier non renseigné dans les paramètres.</p>',
                cible: 'contenu' + this.niveau
            }
        }
        if (this.nom == '') { return undefined }
        if (this.typeDossier) {
            let {html, select} = this.recupHTMLDossier() ;
            return { html, select, cible: 'contenu' + this.niveau, typeDossier: this.typeDossier  }
        } else {
            let {html, select} = this.recupHTMLFichier() ;
            return { html, select, cible: 'contenu' + this.niveau, liens: this.contenu, typeDossier: this.typeDossier }
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
                if (n.substring(0, 1) != '.') {
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
        let html = '<select id="select'+this.niveau+'" onchange="ouvrDoss(this.value, '+(this.niveau + 1)+', \'contenu'+(this.niveau + 1)+'\',this.selectedIndex)">' + "\r\n" ;
        let select = 0 ;
        for (let i in this.liste) {
            let sel = '' ;
            if (this.position == this.contenu[i]) {
                sel = ' selected="selected"' ; 
                select = i ;
            }
            html += '<option value="'+this.contenu[i]+'"'+sel+'>' + this.liste[i] + '</option>' + "\r\n" ;
        }
        html += '</select><br />' + "\r\n" ;
        html += '<div id="contenu'+(this.niveau + 1)+'"></div>' ;
        return {html, select} ;
    }

    recupHTMLFichier() {
        let html = '<br />' ;
        for (let i in this.liste) {
            html += '<span onclick="ouvrFich('+i+')" class="lien">' + this.liste[i] + '</span><br />' + "\r\n" ;
        }
        return {html, select: 0} ;
    }

}
