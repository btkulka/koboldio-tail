const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const Clock = require('../models/Clock');
const Character = require('../models/Character');

// create a character
router.post('/', authenticateJWT, async (req, res) => {
    const clock = await Clock.findById(req.body.clockId);
    if (clock.userId === req.user.id) {
        const character = new Character(req.body);
        character.save()
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

// get all characters
router.get('/', authenticateJWT, async (req, res) => {
    try {
        if (req.query.clockId) {
            const clock = await Clock.findById(req.query.clockId);
            if (clock.userId === req.user.id) {
                const characters = await Character.find({"clockId": clock.id});
                res.json(characters);
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

// get character by id
router.get('/:characterId', authenticateJWT, async (req, res) => {
    try {
        const character = await Character.findById(req.params.characterId);
        const clock = await Clock.findById(character.clockId);
        if (clock.userId === req.user.id) {
            res.json(character);
        } else {
            res.sendStatus(403);
        }
    } catch(err) {
        res.json({
            message: err.message
        });
    }
});

// update character
router.patch('/:characterId', authenticateJWT, async(req, res) => {
    try {
        const character = await Character.findById(req.params.characterId);
        const clock = await Clock.findById(character.clockId);
        if (clock.userId === req.user.id) {
            await Character.findByIdAndUpdate(character.id, { $set: req.body }, (err, e) => {
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

// delete character
router.delete('/:characterId', authenticateJWT, async (req, res) => {
    try {
        const character = await Character.findById(req.params.characterId)
        const clock = await Clock.findById(character.clockId);
        if (clock) {
            if (clock.userId === req.user.id) {
                await Character.findByIdAndRemove(character.id, (err, e) => {
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