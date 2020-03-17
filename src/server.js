const dotenv = require('dotenv');
const express = require('express');

const connectDB = require('./config/db');
const userRouter = require('./routes/user');
const packageRouter = require('./routes/package');
const transactionRouter = require('./routes/transaction');

dotenv.config();
const app = express();

// Connect Database
connectDB();

// Init MiddleWare
app.use(express.json());

app.get('/', (req, res) => res.send('API Running'));

// // Define ROutes
app.use('/api/user', userRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/package', packageRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
