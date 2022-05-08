'use strict';

const multer = require('multer');
const path = require('path');
const crypto =  require('crypto');

const  storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage, limits:{
    files: 1,
    fileSize: 5*1024*1024
}}).single('attachment');

const uploadMiddleware = (req, res, next)=>{
    upload(req, res, (err)=>{
        if(err){
            res.status(403).json({msg: err.message});
            return;
        }
        next();
    });
};

const fileHandler = (req, res, next)=>{
    let link = req.body ? req.body.link: undefined;
    if((link && req.file) || !(link || req.file)){
        if(req.file){
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({msg: 'Send either link or attachment'});
        return;
    }

    let submission_type = link ? 'link': 'file';
    let content = link ? link : req.file.filename;
    let assesment = req.params.assesment_id;
    req.submission = {submission_type, content, assesment};
    next();
}

module.exports = ()=>{
    return [uploadMiddleware, fileHandler];
};
