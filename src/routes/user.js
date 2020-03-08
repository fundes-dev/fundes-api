const express = require('express');
const User = require('../models/user');
const { createUser, findUserByEmail } = require('../services/user');

const router = express.Router();

router.route('/')
  .post(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || email === "") {
      res.status(400).json({ message: 'email must be provided' });
      return;
    }

    if (!password || password === "") {
      res.status(400).json({ message: 'password must be provided' });
      return;
    }
    if (!firstName || firstName === "") {
      res.status(400).json({ message: 'firstName must be provided' });
      return;
    }
    if (!lastName || lastName === "") {
      res.status(400).json({ message: 'lastName must be provided' });
      return;
    }

    try {
      const foundUser = await findUserByEmail(email);
      if (foundUser) {
        res.status(400).json({ message: `email '${email}' already exists'` });
        return;
      }

      const user = await createUser({ email, password, firstName, lastName });
      res.json({ data: { id: user._id } });
    } catch (ex) {
      console.log(ex);
      res.status(500).json({ message: 'internal server error' });
    }
  });

router.route('/login')
  .post(async (req, res) => {
    const { email, password } = req.body;
    if (!email || email === "") {
      res.status(400).json({ message: 'email must be provided' });
      return;
    }

    if (!password || password === "") {
      res.status(400).json({ message: 'password must be provided' });
      return;
    }

    try {
      // does the user exist?
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'password and email do not match' });
        return;
      }

      // do the password match?
      const isMatch = await user.comparePasswords(password);
      if (!isMatch) {
        res.status(400).json({ message: 'password and email do not match' });
        return;
      }

      res.json({ data: { id: user._id } });
    } catch (ex) {
      console.log(ex);
      res.status(500).json({ message: 'internal server error' });
    }
  })

module.exports = router;