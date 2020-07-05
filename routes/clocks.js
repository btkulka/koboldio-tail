const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const Clock = require('../models/Clock');

// create a clock
router.post('/', authenticateJWT, async (req, res) => {
    const clock = new Clock({
        userId: req.user.id,
        campaignName: req.body.campaignName,
        elapsedTime: req.body.elapsedTime,
        elapsedWorldTime: req.body.elapsedWorldTime,
        worldTime: req.body.worldTime,
        campaignDay: req.body.campaignDay,
        mode: req.body.mode,
        currentLocationId: req.body.currentLocationId,
        party: req.body.party
    });

    clock.save()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json(err);
    });
});

// get all clocks
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const clocks = await Clock.find({"userId": req.user.id});
        res.json(clocks);
    } catch(err) {
        res.json({
            message: err.message
        });
    }
});

// get clock by id
router.get('/:clockId', authenticateJWT, async (req, res) => {
    try {
        const clock = await Clock.findById(req.params.clockId);
        if (clock.userId === req.user.id) {
            res.json(clock);
        } else {
            res.sendStatus(403);
        }
    } catch(err) {
        res.json({
            message: err.message
        });
    }
});

// update clock
router.patch('/:clockId', authenticateJWT, async(req, res) => {
    try {
        const clock = await Clock.findById(req.params.clockId);
        if (clock.userId === req.user.id) {
            const clockUpdate = {
                campaignName: req.body.campaignName,
                elapsedTime: req.body.elapsedTime,
                elapsedWorldTime: req.body.elapsedWorldTime,
                worldTime: req.body.worldTime,
                campaignDay: req.body.campaignDay,
                mode: req.body.mode,
                currentLocationId: req.body.currentLocationId,
                party: req.body.party
            }
            await Clock.findByIdAndUpdate(clock.id, { $set: clockUpdate }, (err, c) => {
                if (c) {
                    res.json(c);
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

// delete clock
router.delete('/:clockId', authenticateJWT, async (req, res) => {
    try {
        const clock = await Clock.findById(req.params.clockId);
        if (clock) {
            if (clock.userId === req.user.id) {
                await Clock.findByIdAndRemove(clock.id, (err, c) => {
                    if (c) {
                        res.json(c);
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