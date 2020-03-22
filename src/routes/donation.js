const express = require('express');
const auth = require('../middleware/auth');
const Donation = require('../models/donation');
const Package = require('../models/package');

const router = express.Router();

router.route('/')
  .post(auth, async (req, res) => {
    const {
      user,
      body: {
        recurrence, amount, endDate, npmPackage,
      },
    } = req;

    if (!recurrence || !amount || !endDate || !npmPackage || !user) {
      res.status(400).send({ message: 'invalid request' });
      return;
    }
    const targetPackage = await Package.findById({ _id: npmPackage });
    if (!targetPackage) {
      res.status(400).send({ message: 'no such package found' });
      return;
    }

    const existingDonation = await Donation.findOne({ user: user._id, package: npmPackage });

    if (existingDonation) {
      res.status(400).send({ message: 'invalid request, you already have a donation setup with this package', donation: existingDonation._id });
      return;
    }
    try {
      const donation = new Donation({
        user: user._id,
        recurrence,
        amount,
        endDate,
        package: npmPackage,
        isActive: true,
      });
      const newDonation = await donation.save();

      res.status(200).json({
        message: 'donation successfully set up',
        donation: newDonation._id,
      });
      return;
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'internal server error' });
    }
  })
  .get(auth, async (req, res) => {
    const { user } = req;
    try {
      await user.populate('donations').execPopulate();
      res.send({ donations: user.donations });
    } catch (e) {
      res.status(500).json({ message: 'internal server error' });
    }
  });
router.route('/:id')
  .patch(auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['recurrence', 'amount', 'endDate', 'isActive'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).send({ message: 'this operation is not valid' });
    }
    const { id: donationID } = req.params;
    const donation = await Donation.findOne({ _id: donationID });
    if (!donation) {
      return res.status(400).send({ message: 'donation not found' });
    }
    const { body } = req;
    try {
      updates.forEach((update) => {
        donation[update] = body[update];
        return null;
      });
      const updatedDonation = await donation.save();

      return res.status(200).send({ data: { updatedDonation } });
    } catch (e) {
    // console.log(e);
      return res.status(500).send({ message: 'internal server error' });
    }
  })
  .get(auth, async (req, res) => {
    const { user, params: { id: _id } } = req;
    try {
      const donation = await Donation.findOne({ _id, user: user._id });

      if (!donation) {
        return res.status(404).json({ message: 'donation not found' });
      }
      return res.status(200).json({ donation });
    } catch (e) {
      return res.status(500).json({ message: 'internal server error' });
    }
  });


module.exports = router;
