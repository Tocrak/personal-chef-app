const express = require('express'),
      User = require('../models/user'),
      user = express.Router();


user.use(express.json());

user.get('/check', async (req, res) => {
    try {
        const result = await User.find();

        if (result == null) {
            res.sendStatus(404);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

user.post('/login', async (req, res) => {
    const user = await User.findOne({username: req.body.username})

    if (user == null) {
        // 'User doesn\'t exist';
        res.sendStatus(406);
    } else {
        user.comparePassword(req.body.password, (err, isMatch) => { 
            if (err) throw err;

            if (isMatch) {
                req.session.user = user._id;
                res.cookie('user', user._id)
                res.sendStatus(200);
            } else {
                // 'Incorrect password'
                res.sendStatus(406);
            }
        })
    }
});

user.post('/register', async (req, res) => {
    const user = await User.findOne({username: req.body.username})

    if (user != null && user.username == req.body.username) {
        // 'User already exist';
        res.sendStatus(400);
    } else {
        if (req.body.password1 != req.body.password2) {
            // 'Password doesn\'t match'
            res.sendStatus(406);
        } else {
            const user = new User({
                username: req.body.username,
                password: req.body.password1
            });
            const result = await user.save();   

            if (result == null) {
                res.sendStatus(400);
            } else {
                req.session.user = user._id;
                res.cookie('user', user._id)
                res.sendStatus(200);
            }
        }
    }
});

user.post('/updatePassword', async (req, res) => {
    const user = await User.findById(req.session.user)

    if (user != null) {
    await user.comparePassword(req.body.password0, async (err, isMatch) => { 
        if (err) throw err;

        if (isMatch) {
            if (req.body.password1 != req.body.password2) {
                // 'Password doesn\'t match'
                res.sendStatus(406);
            } else {
                user.password = req.body.password1
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

user.post('/deleteAccount', async (req, res) => {
    const user = await User.findById(req.session.user)

    if (user != null) {
        await user.comparePassword(req.body.password, async (err, isMatch) => { 
        if (err) throw err;

        if (isMatch) {
            await User.findByIdAndDelete(user._id);
            req.session.user = null;
            res.clearCookie('user')
            req.session.destroy();
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

user.post('/logout', async (req, res) => {
    req.session.user = null;
    res.clearCookie('user')
    req.session.destroy();
    res.sendStatus(200);

});


module.exports = user;