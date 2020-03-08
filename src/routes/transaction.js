const express = require('express');
const { postTransaction } = require('../services/transaction');

const router = express.Router();


router.route('/')
  .post(async (req, res) => {
    const {
      user,
      amount,
      date,
      package,
      fundesFee,
      stripeFee
    } = req.body;
    if (!user || user === "") {
      res.status(400).json({ message: 'user must be provided' });
      return;
    }

    if (!amount || amount === "") {
      res.status(400).json({ message: 'amount must be provided' });
      return;
    }
    if (!date || date === "") {
      res.status(400).json({ message: 'date must be provided' });
      return;
    }
    if (!package || package === "") {
      res.status(400).json({ message: 'package must be provided' });
      return;
    }

    try {
      const transaction = await postTransaction({
        user,
        amount,
        date,
        package,
        fundesFee,
        stripeFee
      });
      res.json({ data: { id: transaction._id } });
    } catch (ex) {
      console.log(ex);
      res.status(500).json({ message: 'internal server error' });
    }
  });

module.exports = router;