const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const router = express.Router();

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

module.exports = router;
