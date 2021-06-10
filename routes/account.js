const express = require('express'),
      User = require('../models/user'),
      utils = require('../utils/utils'),
      user = express.Router();

user.use(express.json());

user.post('/login', async (req, res) => {
    const data = utils.decodeRequestBody(req.body)
    const user = await User.findOne({username: data.username})

    if (user == null) {
        // 'User doesn\'t exist';
        res.sendStatus(406);
    } else {
        user.comparePassword(req.body.password, (err, isMatch) => { 
            if (err) throw err;

            if (isMatch) {
                const token = utils.generateAccessToken({ username: data.username });
                res.cookie('user', user._id, {maxAge: 1800 * 1000})
                res.cookie('auth-token', token, {maxAge: 1800 * 1000, httpOnly: true})
                res.sendStatus(200);
            } else {
                // 'Incorrect password'
                res.sendStatus(406);
            }
        })
    }
});

user.post('/register', async (req, res) => {
    const data = utils.decodeRequestBody(req.body)
    const user = await User.findOne({username: data.username})

    if (user != null && user.username == req.body.username) {
        // 'User already exist';
        res.sendStatus(400);
    } else {
        if (req.body.password1 != req.body.password2) {
            // 'Passwords don\'t match'
            res.sendStatus(406);
        } else {
            const user = new User({
                username: data.username,
                password: data.password1
            });
            const result = await user.save();   

            if (result == null) {
                res.sendStatus(400);
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
                // 'Password doesn\'t match'
                res.sendStatus(406);
            } else {
                user.password = data.password1
                const result = await user.save();   

                if (result == null) {
                    res.sendStatus(400);
                } else {
                    res.sendStatus(200);
                }
            }
        } else {
            // 'Incorrect password'
            res.sendStatus(406);
        }
    })
    } else {
        res.sendStatus(400);
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
            // 'Incorrect password'
            res.sendStatus(406);
        }
    })
    } else {
        res.sendStatus(400);
    }
});

user.post('/logout', utils.authenticateToken, async (req, res) => {
    res.clearCookie('user');
    res.clearCookie('auth-token');
    res.sendStatus(200);
});

module.exports = user;