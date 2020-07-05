const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const Clock = require('../models/Clock');

// create an event
router.post('/', authenticateJWT, async (req, res) => {
    const clock = await Clock.findById(req.body.clockId);
    if (clock.userId === req.user.id) {
        const event = new Event(req.body);
        event.save()
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

// get all events
router.get('/', authenticateJWT, async (req, res) => {
    try {
        if (req.query.clockId) {
            const clock = await Clock.findById(req.query.clockId);
            if (clock.userId === req.user.id) {
                const events = await Event.find({"clockId": clock.id});
                res.json(events);
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

// get event by id
router.get('/:eventId', authenticateJWT, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        const clock = await Clock.findById(event.clockId);
        if (clock.userId === req.user.id) {
            res.json(event);
        } else {
            res.sendStatus(403);
        }
    } catch(err) {
        res.json({
            message: err.message
        });
    }
});

// update event
router.patch('/:eventId', authenticateJWT, async(req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        const clock = await Clock.findById(event.clockId);
        if (clock.userId === req.user.id) {
            await Event.findByIdAndUpdate(event.id, { $set: req.body }, (err, e) => {
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

// delete event
router.delete('/:eventId', authenticateJWT, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
        const clock = await Clock.findById(event.clockId);
        if (clock) {
            if (clock.userId === req.user.id) {
                await Event.findByIdAndRemove(event.id, (err, e) => {
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