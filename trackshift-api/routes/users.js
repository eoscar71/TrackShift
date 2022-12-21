const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const userAuth = require('../middleware/userAuth');
const { User, validate } = require("../models/user");
const router = express.Router();

// Register user
router.post("/", async (req, res) => {
    const {error} = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user)
        return res.status(400).send('This user is already registered.');
    
    user = new User({
        email: req.body.email,
        password: req.body.password
    });
    
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    
    user = await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(_.pick(user, ["_id", "email"]));
});

// Change user password
router.put('/', [userAuth], async (req, res) => {
    let user = await User.findById(req.user._id);
        
    const validPassword = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!validPassword)
        return res.status(400).send("Invalid password.");
    
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    
    user = await user.save();
        
    res.send(true);
});

// Delete user account
router.delete('/', [userAuth], async (req, res) => {
    let user = req.user;
    user = await User.findByIdAndRemove(user._id);
    res.send(true);
});

module.exports = router;
