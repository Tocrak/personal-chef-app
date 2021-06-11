const express = require('express'),
      User = require('../models/user'),
      utils = require('../utils/utils'),
      user = express.Router();

user.use(express.json());

user.post('/login', async (req, res) => {
    const data = utils.decodeRequestBody(req.body)
    const user = await User.findOne({username: data.username})

    if (user == null) {
        res.status(406).json({message: 'User doesn\'t exist'});
    } else {
        user.comparePassword(req.body.password, (err, isMatch) => { 
            if (err) throw err;

            if (isMatch) {
                const token = utils.generateAccessToken({ username: data.username });
                res.cookie('user', user._id, {maxAge: 1800 * 1000})
                res.cookie('auth-token', token, {maxAge: 1800 * 1000, httpOnly: true})
                res.sendStatus(200);
            } else {
                res.status(406).json({message: 'Incorrect password'});
            }
        })
    }
});

user.post('/register', async (req, res) => {
    const data = utils.decodeRequestBody(req.body)
    const user = await User.findOne({username: data.username})

    if (user != null && user.username == req.body.username) {
        res.status(406).json({message: 'User already exist'});
    } else {
        if (req.body.password1 != req.body.password2) {
            res.status(406).json({message: 'Passwords don\'t match'});
        } else {
            const user = new User({
                username: data.username,
                password: data.password1
            });
            const result = await user.save();   

            if (result == null) {
                res.status(500).json({message: 'Unable to save to database'});
            } else {                
                const token = utils.generateAccessToken({ username: data.username });
                res.cookie('user', user._id, {maxAge: 1800 * 1000})
                res.cookie('auth-token', token, {maxAge: 1800 * 1000, httpOnly: true})
                res.sendStatus(200);
            }
        }
    }
});

user.patch('/updatePassword', utils.authenticateToken, async (req, res) => {
    const data = utils.decodeRequestBody(req.body)
    const user = await User.findById(req.cookies.user)

    if (user != null) {
    await user.comparePassword(data.password0, async (err, isMatch) => { 
        if (err) throw err;

        if (isMatch) {
            if (data.password1 != data.password2) {
                res.status(406).json({message: 'Passwords don\'t match'});
            } else {
                user.password = data.password1
                const result = await user.save();   

                if (result == null) {
                    res.status(500).json({message: 'Unable to save to database'});
                } else {
                    res.sendStatus(200);
                }
            }
        } else {
            res.status(406).json({message: 'Incorrect password'});
        }
    })
    } else {
        res.status(406).json({message: 'User not found'});
    }
});

user.delete('/deleteAccount', utils.authenticateToken, async (req, res) => {
    const data = utils.decodeRequestBody(req.body)
    const user = await User.findById(req.cookies.user)

    if (user != null) {
        await user.comparePassword(data.password, async (err, isMatch) => { 
        if (err) throw err;

        if (isMatch) {
            await User.findByIdAndDelete(user._id);
            res.clearCookie('user');
            res.clearCookie('auth-token');
            res.sendStatus(200);
        } else {
            res.status(406).json({message: 'Incorrect password'});
        }
    })
    } else {
        res.status(406).json({message: 'User not found'});
    }
});

user.post('/logout', utils.authenticateToken, async (req, res) => {
    res.clearCookie('user');
    res.clearCookie('auth-token');
    res.sendStatus(200);
});

module.exports = user;