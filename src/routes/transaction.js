const express = require('express');
const { postTransaction, findTransactionById } = require('../services/transaction');

const router = express.Router();


router.route('/')
  .post(async (req, res) => {
    const {
      user,
      amount,
      date,
      packageName,
      fundesFee,
      stripeFee,
    } = req.body;
    if (!user || user === '') {
      res.status(400).json({ message: 'user must be provided' });
      return;
    }

    if (!amount || amount === '') {
      res.status(400).json({ message: 'amount must be provided' });
      return;
    }
    if (!date || date === '') {
      res.status(400).json({ message: 'date must be provided' });
      return;
    }
    if (!packageName || packageName === '') {
      res.status(400).json({ message: 'packageName must be provided' });
      return;
    }

    try {
      const transaction = await postTransaction({
        user,
        amount,
        date,
        packageName,
        fundesFee,
        stripeFee,
      });
      res.json({ data: { id: transaction._id } });
    } catch (ex) {
      res.status(500).json({ message: 'internal server error' });
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    const _id = req.params.id;
    try {
      const transaction = await findTransactionById(_id);
      if (!transaction) {
        return res.status(404).json({ message: 'transaction not found' });
      }
      return res.status(200).json({ data: { transaction } });
    } catch (e) {
      return res.status(500).json({ message: 'internal server error' });
    }
  });

module.exports = router;
