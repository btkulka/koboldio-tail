const express = require("express");
const router = express.Router();
const passwordHash = require("password-hash");
const authenticateJWT = require("../middleware/authenticateJWT");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// CRUD Methods =============================

// Creates a user
router.post('/', async (req, res) => {
    try {
        
        let userExists = false;
        await User.find()
            .or([
                {'username': req.body.username},
                {'email': req.body.email}
            ])
            .then((user) => {
                if (user.length > 0) {
                    userExists = true
                }
            })
            .catch((err) => { });

        if(userExists) {
            throw(new Error("Username/email already registered with kobold.io"));
        }

        const user = new User({
            username: req.body.username,
            password: passwordHash.generate(req.body.password),
            email: req.body.email
        });
    
        user.save()
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json({
                    status: 500,
                    message: err.message
                });
            });
    } catch(err) {
        res.json({
            status: 403,
            message: err.message
        });
    }
});

// Gets all users
router.get('/', authenticateJWT,  async (req, res) => {
    try {
        const users = await User.find();
        res.json(user);
    } catch(err) {
        res.json(err);
    }
});

// Gets user by id
router.get('/:userId', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch(err) {
        res.json(err);
    }
});

// Deletes a user by id
router.delete('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (user) {
            res.json(user);
        } else {
            throw(new Error("User not found."));
        }
    } catch (err) {
        res.json(err);
    }
});

// Auxillary Methods ==================================
router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let userIdentifier = username;
        if (!userIdentifier) {
            userIdentifier = email;
        }

        if (!userIdentifier || !password) {
            throw(new Error("Missing username/email/password."));
        }

        const authError = new Error("Invalid username/email/password");
        await User.findOne()
            .or([
                { 'username' : userIdentifier},
                { 'email':  userIdentifier }
            ])
            .then((user) => {
                if(passwordHash.verify(password, user.password)) {
                    const token = jwt.sign({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }, process.env.JWT_SECRET);
                    res.json({
                        token
                    });
                } else {
                    throw(authError);
                }
            })
            .catch((err) => {
                throw(authError);
            });

    } catch(err) {
        res.json({
            message: err.message
        });
    }
})


module.exports = router;