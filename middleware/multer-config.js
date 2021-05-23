/* Multer est un module de gestion des fichiers
Dans ce cas il sert à la reception et gestion 
des images envoyées par les utilisateurs du front */

const multer = require('multer');

//MIME type utilisé coté front :
const MIME_TYPE = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'img')
    },
    filename: (req, file, callback) => {
        //Enlever les espaces dans le nom de fichier et l'enxtension
        const name = file.originalname.split(' ').join('_').split('.')[0];
        //Ajouter l'exentension à partir du MIME_TYPE renvoyé par le front
        const extension = MIME_TYPE[file.mimetype];
        //Etape 3 -> le callback
        callback(null, name + Date.now() + '.' + extension)
        /* L'idée est de rendre le nom de fichier le plus unique possible
        c'est la raison pour laquelle on utilise un timestamp */
    },
})


module.exports = multer({ storage }).single( 'image' );// NB : La méthode 'single()' précise qu'il s'agit d'un fichier et non d'un groupe de fichier
