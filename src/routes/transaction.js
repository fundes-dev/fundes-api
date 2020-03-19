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
        amount, packageID, donationID,
      },
    } = req;

    if (!amount || !packageID || !donationID) {
      res.status(400).json({ message: 'invalid request' });
      return;
    }

    try {
      const newTransaction = new Transaction({
        user,
        amount,
        packageID,
        donationID,
        fundesFee: 0,
        stripeFee: 0,
      });

      const transaction = await newTransaction.save();

      const npmPackage = await NPMPackage.findById(packageID);
      const donation = await Donation.findById(donationID);

      if (!npmPackage || !donation) {
        res.status(400).json({ message: 'resources not found' });
        return;
      }

      // add transaction ref to package
      npmPackage.transactions = [...npmPackage.transactions, transaction._id];
      await npmPackage.save();

      // add transaction ref to user
      user.transactions = [...user.transactions, transaction._id];
      await user.save();

      // add transaction ref to donation
      donation.transactionIDs = [...donation.transactionIDs, transaction._id];
      await donation.save();

      res.send({ transaction: { id: transaction._id } });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'internal server error' });
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    const _id = req.params.id;
    try {
      const transaction = await Transaction.findById(_id);
      if (!transaction) {
        return res.status(404).json({ message: 'transaction not found' });
      }
      return res.status(200).json({ data: { transaction } });
    } catch (e) {
      return res.status(500).json({ message: 'internal server error' });
    }
  });

module.exports = router;
