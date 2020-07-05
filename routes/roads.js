const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const Clock = require('../models/Clock');
const Road = require("../models/Road");

// create a road
router.post('/', authenticateJWT, async (req, res) => {
    const clock = await Clock.findById(req.body.clockId);
    if (clock.userId === req.user.id) {
        const road = new Road(req.body);
        road.save()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({
                message: err.message
            });
        });
    } else {
        res.sendStatus(403);
    }
});

// get all roads
router.get('/', authenticateJWT, async (req, res) => {
    try {
        if (req.query.clockId) {
            const clock = await Clock.findById(req.query.clockId);
            if (clock.userId === req.user.id) {
                const roads = await Road.find({"clockId": clock.id});
                res.json(roads);
            } else {
                res.sendStatus(403);
            }
        } else {
            throw(new Exception("You must filter by clockId in querystring."));
        }
        
    } catch(err) {
        res.json({
            message: err.message
        });
    }
});

// get road by id
router.get('/:roadId', authenticateJWT, async (req, res) => {
    try {
        const road = await Road.findById(req.params.roadId);
        const clock = await Clock.findById(road.clockId);
        if (clock.userId === req.user.id) {
            res.json(road);
        } else {
            res.sendStatus(403);
        }
    } catch(err) {
        res.json({
            message: err.message
        });
    }
});

// update road
router.patch('/:roadId', authenticateJWT, async(req, res) => {
    try {
        const road = await Road.findById(req.params.roadId);
        const clock = await Clock.findById(road.clockId);
        if (clock.userId === req.user.id) {
            await Road.findByIdAndUpdate(road.id, { $set: req.body }, (err, e) => {
                if (e) {
                    res.json(e);
                }

                if (err) {
                    res.json({
                        status: 500,
                        message: err.message
                    });
                }
            })
        } else {
            res.sendStatus(403);
        }
    } catch (err) {
        res.json({
            message: err.message
        });
    }
})

// delete road
router.delete('/:roadId', authenticateJWT, async (req, res) => {
    try {
        const road = await Road.findById(req.params.roadId)
        const clock = await Clock.findById(road.clockId);
        if (clock) {
            if (clock.userId === req.user.id) {
                await Road.findByIdAndRemove(road.id, (err, e) => {
                    if (e) {
                        res.json(e);
                    }

                    if (err) {
                        res.json({
                            status: 500,
                            message: err.message
                        });
                    }
                });
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(404);
        }
       
    } catch(err) {
        res.json({
            message: err.message
        });
    }
});

module.exports = router;