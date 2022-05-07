'use strict';

const submissionModel = require('../models/Submission');
const fs = require('fs');
const path = require('path');

module.exports.getOne = async (req, res) => {
    let filter = {submission_id: req.params.submission_id};
    if(req.user.role === 'student'){
        filter.submitted_by = req.user._id;
    }

    let doc = await submissionModel.findOne(filter);
    if(!(doc && doc.submission_type==='file' && doc.content===req.params.file_name)){
        res.status(403).json({msg: 'File not found or insufficient permission.'});
        return;
    }
    if(! fs.existsSync(path.join(process.env.UPLOAD_PATH, doc.content))){
        res.status(404).json({msg: 'File deleted from server.'});
        return;
    }
    res.sendFile(doc.content, {root: path.join(process.cwd(), process.env.UPLOAD_PATH)});
};
