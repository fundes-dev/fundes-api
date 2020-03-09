const Transaction = require('../models/transaction');

const postTransaction = async ({
  user,
  amount,
  date,
  packageName,
  fundesFee,
  stripeFee,
}) => {
  const newTransaction = new Transaction({
    user,
    amount,
    date,
    packageName,
    fundesFee,
    stripeFee,
  });
  const transaction = await newTransaction.save();
  return transaction;
};

const findTransactionById = async (_id) => {
  const transaction = await Transaction.findOne({ _id });
  return transaction;
};

module.exports = { postTransaction, findTransactionById };
