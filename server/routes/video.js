const express = require('express');
const router = express.Router();
const ffmpeg = require('fluent-ffmpeg');
const multer = require('multer');   
const {Video} = require('../models/Video');
const {Subscriber} = require('../models/Subscriber');

router.post("/getsubscriptionvideos", (req, res) => {
    Subscriber.find({"userFrom": req.body.userFrom})
            .exec((err, subs) => {
                if(err) return res.status(400).json({success: false, err});

                let subscribedUsers = [];

                subs.map(subscriber => {
                    subscribedUsers.push(subscriber.userTo);
                })

                Video.find({writer: {$in: subscribedUsers}})
                    .populate('writer')
                    .exec((err, videos) => {
                        if(err) return res.status(400).json({success: false, err});
                        return res.status(200).json({success:true, videos})
                    })
            })
})



let  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req,file,cb) => {
        const ext = path.extname(file.originalname);
        if(ext !== '.mp4' || ext !== '.jpg'){
            return cb(res.status(400).end("Only mp4 and jpg files allowed"));
        }
        cb(null, true);
    }
  })
let upload = multer({ storage: storage }).single("file");


router.post('/uploadfiles', (req, res) => {
    upload(req, res, err => {
        if(err){
            console.log(err);
            return res.json({success:false, err})
        }
        else{
            return res.json({success:true, filePath: res.req.file.path, fileName: res.req.file.filename})
        }
    })
})

router.post('/uploadvideo', (req, res) => {
    const video = new Video(req.body)
    video.save()
        .then((video, err) => {
            if(err){
                // console.log('here',err);
                return res.status(400).json({success: false, err})
            }
            return res.status(200).json({success:true})
        })
})

router.get('/getvideos', (req, res) => {
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).json({success: false});
            else return res.status(200).json({success: true, videos})
        })
})

router.post('/getvideo', (req, res) => {
    let viewsc;
    Video.findOne({_id: req.body.videoId})
        .populate('writer')
        .exec((err,video) => {
            if(err){
                return res.status(400).json({success: false, err});
            }
            else{
                viewsc = video.views + 1;
                // console.log(viewsc, video.views);
                Video.findOneAndUpdate({_id: req.body.videoId}, {views: viewsc})
                    .exec((err, video) => {
                        if(err) console.log(err);
                })
                
                return res.status(200).json({success:true, video});
            }
        })
    
        
})

router.post('/thumbnail', (req, res) => {
    let base64Data = req.body.previewSrc.replace(/^data:image\/png;base64,/, "");
    const thumbsFilePath = "uploads/thumbnails/" + Date.now() + ".png"
    require("fs").writeFile(thumbsFilePath, base64Data, 'base64', function(err,data) {
        if(err) return res.json({success: true})
        return res.json({success: true , thumbsFilePath: thumbsFilePath})
    });
})



module.exports = router;