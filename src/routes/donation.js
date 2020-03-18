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
        recurrence, amount, endDate, packageID,
      },
    } = req;

    if (!recurrence || !amount || !endDate || !packageID || !user) {
      res.status(400).send({ message: 'invalid request' });
      return;
    }
    const targetPackage = await Package.findById({ _id: packageID });
    if (!targetPackage) {
      res.status(400).send({ message: 'no such package found' });
    }
    try {
      const donation = new Donation({
        userID: user._id,
        recurrence,
        amount,
        endDate,
        packageID,
        isActive: true,
      });
      const newDonation = await donation.save();

      // add donation ref to package
      targetPackage.donations = [...targetPackage.donations, newDonation._id];
      await targetPackage.save();

      // add donation ref to user
      user.donations = [...user.donations, newDonation._id];
      await user.save();

      res.status(200).json({
        message: 'donation successfully set up',
        donationID: newDonation._id,
      });
    } catch (e) {
      res.status(500).json({ message: 'internal server error' });
    }
  });
router.route('/:id').patch(auth, async (req, res) => {
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
});


module.exports = router;
