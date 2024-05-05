const multer = require('multer');

//Defiine the storage for the images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        //null is for error handling 
        //Date.now() is for unique name
        //file.originalname is for the original name of the file
        cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname)
    },

})
// File size formatter
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

//Specify the file type 
function fileFilter(req, file, cb) {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }

}

const upload = multer({ storage, fileFilter })

module.exports = { upload, formatBytes };