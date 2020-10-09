const express = require('express');
const router = express.Router();
const {Subscriber} = require('../models/Subscriber');


router.post('/subscribenumber', (req, res) => {

    Subscriber.find({"userTo": req.body.userTo})
            .exec((err, subscribe) => {
                if(err) return res.status(400).json({success: false, err});
                return res.status(200).json({success:true, subscribeNumber: subscribe.length })
            })
})

router.post('/subscribed', (req, res) => {

    Subscriber.find({"userTo": req.body.userTo, "userFrom": req.body.userFrom})
            .exec((err, subscribe) => {
                if(err) return res.status(400).json({success: false, err});
                let result = false;
                // console.log(subscribe, subscribe.length);
                if(subscribe.length !== 0) result = true;
                return res.status(200).json({success:true, subscribed: result})
            })
})

router.post('/subscribe', (req, res) => {

    const sub = new Subscriber(req.body);
    sub.save((err, sub) => {
        if(err) return res.status(400).json({success:false, err});
        return res.status(200).json({success: true});
    })
})

router.post('/unsubscribe', (req, res) => {
    
    Subscriber.findOneAndDelete({"userTo": req.body.userTo, "userFrom": req.body.userFrom})
        .exec((err, doc) => {
            if(err) res.status(400).json({success: false, err});
            res.status(200).json({success: true, doc});
        })
    
})


module.exports = router;