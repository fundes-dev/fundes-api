const express = require('express');
const auth = require('../middleware/auth');

const Transaction = require('../models/transaction');
const NPMPackage = require('../models/package');
const Donation = require('../models/donation');

const router = express.Router();


router.route('/')
  .post(auth, async (req, res) => {
    const {
      user,
      body: {
        amount, package: packageId, donation: donationId,
      },
    } = req;

    if (!amount || !packageId || !donationId) {
      res.status(400).json({ message: 'invalid request' });
      return;
    }

    try {
      const newTransaction = new Transaction({
        user,
        amount,
        package: packageId,
        donation: donationId,
        fundesFee: 0,
        stripeFee: 0,
      });

      const transaction = await newTransaction.save();

      const npmPackage = await NPMPackage.findById(packageId);
      const donation = await Donation.findById(donationId);

      if (!npmPackage || !donation) {
        res.status(400).json({ message: 'resources not found' });
        return;
      }

      res.send({ transaction });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'internal server error' });
    }
  })
  .get(auth, async (req, res) => {
    const { user } = req;
    try {
      await user.populate('transactions').execPopulate();
      res.send({ transactions: user.transactions });
    } catch (e) {
      res.status(500).json({ message: 'internal server error' });
    }
  });

router.route('/package')
  .get(async (req, res) => {
    const { body: { package: packageId } } = req;
    try {
      const transactions = await Transaction.find({ package: packageId });

      if (!transactions) {
        return res.status(404).json({ message: 'transaction not found' });
      }
      return res.status(200).json({ transactions });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'internal server error' });
    }
  });
router.route('/user')
  .get(auth, async (req, res) => {
    const { user } = req;
    try {
      const transactions = await Transaction.find({ user });

      if (!transactions) {
        return res.status(404).json({ message: 'transaction not found' });
      }
      return res.status(200).json({ transactions });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'internal server error' });
    }
  });
router.route('/:id')
  .get(auth, async (req, res) => {
    const { user, params: { id: _id } } = req;
    try {
      // const transaction = await Transaction.findById(_id);
      const transaction = await Transaction.findOne({ _id, user: user._id });

      if (!transaction) {
        return res.status(404).json({ message: 'transaction not found' });
      }
      return res.status(200).json({ transaction });
    } catch (e) {
      return res.status(500).json({ message: 'internal server error' });
    }
  });

module.exports = router;
