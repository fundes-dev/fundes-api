const express = require('express');
const {
  createUser, findUserByEmail,
} = require('../services/user');
const auth = require('../middleware/auth');
const Donation = require('../models/donation');

const router = express.Router();

router.route('/')
  .post(async (req, res) => {
    const {
      email, password, firstName, lastName,
    } = req.body;
    if (!email || !password || !firstName || !lastName) {
      res.status(400).send({ message: 'invalid request' });
      return;
    }

    try {
      const foundUser = await findUserByEmail(email);
      if (foundUser) {
        res.status(400).send({ message: `email '${email}' already exists'` });
        return;
      }

      const user = await createUser({
        email, password, firstName, lastName,
      });
      const token = await user.generateAuthToken();
      res.send({ data: { user, token } });
    } catch (ex) {
      res.status(500).send({ message: 'internal server error' });
    }
  });

router.route('/me')
  .get(auth, async (req, res) => {
    const { user } = req;
    res.status(200).send({ user });
  })
  .delete(auth, async (req, res) => {
    const { user } = req;
    try {
      await user.remove();
      return res.status(200).send({ user });
    } catch (e) {
      return res.status(500).send({ message: 'internal server error' });
    }
  })

  .patch(auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['email', 'password', 'firstName', 'lastName'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).send({ message: 'this operation is not valid' });
    }

    const { body, user } = req;
    try {
      updates.forEach((update) => {
        user[update] = body[update];
        return null;
      });
      await user.save();

      return res.status(200).send({ data: { user } });
    } catch (e) {
      return res.status(500).send({ message: 'internal server error' });
    }
  });

router.route('/login')
  .post(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ message: 'invalid request' });
      return;
    }

    try {
      const user = await findUserByEmail(email);
      if (!user) {
        res.status(400).send({ message: 'unable to login' });
        return;
      }

      const isMatch = await user.comparePasswords(password);
      if (!isMatch) {
        res.status(400).send({ message: 'unable to login' });
        return;
      }
      const token = await user.generateAuthToken();
      res.send({ user, token });
    } catch (e) {
      res.status(500).send({ message: 'internal server error' });
    }
  });

router.route('/logout')
  .post(auth, async (req, res) => {
    const { user, token: reqToken } = req;
    try {
      user.tokens = user.tokens.filter((token) => token.token !== reqToken);
      await user.save();
      res.send({ message: 'logout successful' });
    } catch (e) {
      res.status(500).send({ message: 'internal server error' });
    }
  });

router.route('/logout-all')
  .post(auth, async (req, res) => {
    const { user } = req;
    try {
      user.tokens = [];
      await user.save();
      res.send();
    } catch (e) {
      res.status(500).send({ message: 'internal server error' });
    }
  });

module.exports = router;
