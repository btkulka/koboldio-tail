const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const Clock = require('../models/Clock');
const Location = require('../models/Location');

// create a location
router.post('/', authenticateJWT, async (req, res) => {
    const clock = await Clock.findById(req.body.clockId);
    if (clock.userId === req.user.id) {
        const location = new Location(req.body);
        location.save()
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

// get all locations
router.get('/', authenticateJWT, async (req, res) => {
    try {
        if (req.query.clockId) {
            const clock = await Clock.findById(req.query.clockId);
            if (clock.userId === req.user.id) {
                const locations = await Location.find({"clockId": clock.id});
                res.json(locations);
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

// get location by id
router.get('/:locationId', authenticateJWT, async (req, res) => {
    try {
        const location = await Location.findById(req.params.locationId);
        const clock = await Clock.findById(location.clockId);
        if (clock.userId === req.user.id) {
            res.json(location);
        } else {
            res.sendStatus(403);
        }
    } catch(err) {
        res.json({
            message: err.message
        });
    }
});

// update location
router.patch('/:locationId', authenticateJWT, async(req, res) => {
    try {
        const location = await Location.findById(req.params.locationId);
        const clock = await Clock.findById(location.clockId);
        if (clock.userId === req.user.id) {
            await Location.findByIdAndUpdate(location.id, { $set: req.body }, (err, e) => {
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

// delete location
router.delete('/:locationId', authenticateJWT, async (req, res) => {
    try {
        const location = await Location.findById(req.params.locationId)
        const clock = await Clock.findById(location.clockId);
        if (clock) {
            if (clock.userId === req.user.id) {
                await Location.findByIdAndRemove(location.id, (err, e) => {
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