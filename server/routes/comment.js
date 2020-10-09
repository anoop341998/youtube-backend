const express = require('express');
const router = express.Router();
const {Comment} = require('../models/Comment');


router.post("/savecomment", (req, res) => {
    // console.log(req.body);
    const comment = new Comment(req.body);
    // console.log(comment);
    comment.save()
        .then((comment, err) => {
            if(err) {
                // console.log(err)
                return res.status(400).json({'success': false, err});
            }

            Comment.find({'_id': comment._id})
                .populate('writer')
                .exec((err, comment) =>{
                    if(err) return res.status(400).json({'success': false, err});
                    return res.status(200).json({'success': true, comment});
                })
        })
})

router.post("/getcomments", (req, res) => {
    // console.log(req.body.videoId);
    Comment.find({'postId': req.body.videoId})
        .populate('writer')
        .exec((err, comments) => {
            if(err) return res.status(400).json({success: false, err});
            // console.log('hi',comments);
            return res.status(200).json({success: true, comments});
        })
})

module.exports = router;