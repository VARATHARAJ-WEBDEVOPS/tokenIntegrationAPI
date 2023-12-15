const express = require('express');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        var emailExist = await userModel.findOne({ email: req.body.email });
        if (emailExist) {
            return res.status(400).json({ message: "   email already exist :(   " });
        }

        //pasword hash
        var hash = await bcrypt.hash(req.body.password, 10);

        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        var data = await user.save();
        res.status(200).json({message: 'Account Created Successfully :) ', data: data});
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/login', async (req, res) => {
    var userData = await userModel.findOne({ email: req.body.email });
    if (!userData) {
        return res.status(400).json({ message: "  email not exist :(  " });
    }
    try {
        var validPassword = await bcrypt.compare(req.body.password, userData.password);
        if (!validPassword) {
            return res.status(400).json({ message: "  password not valid :(  " });
        }
        var userToken = jwt.sign({ email: userData.email, name: userData.name, id: userData._id }, 'periyaRagasiyam');
        res.header('auth', userToken).json({ message: 'Login successful :)', data: userToken });
    } catch (error) {
        res.status(500).json(error);
    }
});

const validUser = (req, res, next) => {
    var token = req.header('auth');
    req.token = token
    next();
}

router.get('/getUserData', validUser, async (req, res) => {
    jwt.verify(req.token, 'periyaRagasiyam', async (err, data) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                console.log(data);
                const userId = data.id;
                const user = await userModel.findById(userId);

                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                } else {
                    res.status(200).json(user);
                }
            } catch (error) {
                res.status(500).json(error);
            }
        }
    });
});


router.get('/getAll', validUser, async (req, res) => {

    jwt.verify(req.token, 'periyaRagasiyam', async (err, data) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                const Users = await userModel.find().select(['-password']);
                res.status(200).json(Users)
            } catch (error) {
                res.status(500).json(error);
            }
        }
    });
});



module.exports = router;