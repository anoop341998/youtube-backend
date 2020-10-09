const express = require('express');
const router = express.Router();

const {Like} = require('../models/Like.js');
const {Dislike} = require('../models/Dislike.js');

router.post('/getlikes', (req, res) => {
    let variable;

    if(req.body.videoId){
        variable = {videoId: req.body.videoId};
    }
    else{
        variable = {commentId: req.body.commentId}
    }

    Like.find(variable)
        .exec((err, likes) => {
            if(err) return res.status(400).json({success:false, err})
            return res.status(200).json({success: true, likes})
        })
})

router.post('/getdislikes', (req, res) => {
    let variable;

    if(req.body.videoId){
        variable = {videoId: req.body.videoId};
    }
    else{
        variable = {commentId: req.body.commentId}
    }

    Dislike.find(variable)
        .exec((err, dislikes) => {
            if(err) return res.status(400).json({success:false, err})
            return res.status(200).json({success: true, dislikes})
        })
})


router.post('/pluslike', (req, res) => {
    let variable;

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId: req.body.userId};
    }
    else{
        variable = {commentId: req.body.commentId, userId: req.body.userId};
    }

    const like = new Like(variable);

    like.save((err, likeResult) => {
        if (err) return res.json({success:false, err});

        Dislike.findOneAndDelete(variable)
            .exec((err, dislikeResult) => {
                if(err) return res.status(400).json({success: false, err});
                return res.status(200).json({success:true})
            }) 
    })

})

router.post('/unlike', (req, res) => {
    let variable;

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId: req.body.userId};
    }
    else{
        variable = {commentId: req.body.commentId, userId: req.body.userId};
    }


    Like.findOneAndDelete(variable)
        .exec((err, dislikeResult) => {
            if(err) return res.status(400).json({success: false, err});
            return res.status(200).json({success:true})
        })

})

router.post('/undislike', (req, res) => {
    let variable;

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId: req.body.userId};
    }
    else{
        variable = {commentId: req.body.commentId, userId: req.body.userId};
    }


    Dislike.findOneAndDelete(variable)
        .exec((err, dislikeResult) => {
            if(err) return res.status(400).json({success: false, err});
            return res.status(200).json({success:true})
        })

})


router.post('/updislike', (req, res) => {
    let variable;

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId: req.body.userId};
    }
    else{
        variable = {commentId: req.body.commentId, userId: req.body.userId};
    }

    const dislike = new Dislike(variable);

    dislike.save((err, dislikeResult) => {
        if (err) return res.json({success:false, err});

        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if(err) return res.status(400).json({success: false, err});
                return res.status(200).json({success:true})
            }) 
    })

})



module.exports = router;