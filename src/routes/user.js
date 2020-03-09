const express = require('express');
const User = require('../models/user');
const {
  createUser, findUserByEmail, findUserById, updateUserById,
} = require('../services/user');

const router = express.Router();

router.route('/')
  .post(async (req, res) => {
    const {
      email, password, firstName, lastName,
    } = req.body;
    if (!email || email === '') {
      res.status(400).json({ message: 'email must be provided' });
      return;
    }

    if (!password || password === '') {
      res.status(400).json({ message: 'password must be provided' });
      return;
    }
    if (!firstName || firstName === '') {
      res.status(400).json({ message: 'firstName must be provided' });
      return;
    }
    if (!lastName || lastName === '') {
      res.status(400).json({ message: 'lastName must be provided' });
      return;
    }

    try {
      const foundUser = await findUserByEmail(email);
      if (foundUser) {
        res.status(400).json({ message: `email '${email}' already exists'` });
        return;
      }

      const user = await createUser({
        email, password, firstName, lastName,
      });
      res.json({ data: { id: user._id } });
    } catch (ex) {
      res.status(500).json({ message: 'internal server error' });
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    const _id = req.params.id;
    try {
      const user = await findUserById(_id);
      if (!user) {
        return res.status(404).json({ message: 'user not found' });
      }
      return res.status(200).json({ data: { user } });
    } catch (e) {
      return res.status(500).json({ message: 'internal server error' });
    }
  });

router.route('/:id')
  .patch(async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['email', 'password', 'firstName', 'lastName'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ message: 'this operation is not valid' });
    }

    const _id = req.params.id;
    const { body } = req;
    try {
      const user = await updateUserById(_id, body);
      if (!user) {
        return res.status(404).json({ message: 'user not found' });
      }
      return res.status(200).json({ data: { user } });
    } catch (e) {
      return res.status(500).json({ message: 'internal server error' });
    }
  });


router.route('/login')
  .post(async (req, res) => {
    const { email, password } = req.body;
    if (!email || email === '') {
      res.status(400).json({ message: 'email must be provided' });
      return;
    }

    if (!password || password === '') {
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

      // does the password match?
      const isMatch = await user.comparePasswords(password);
      if (!isMatch) {
        res.status(400).json({ message: 'password and email do not match' });
        return;
      }

      res.json({ data: { id: user._id } });
    } catch (e) {
      res.status(500).json({ message: 'internal server error' });
    }
  });

module.exports = router;
