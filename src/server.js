const dotenv = require('dotenv');
const express = require('express');

const connectDB = require('./config/db')
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

dotenv.config();
const app = express();

// Connect Database
connectDB();

// Init MiddleWare
app.use(express.json());

app.get('/', (req, res) => {
  return res.send('API Running')
});

// // Define ROutes
app.use('api/user', userRouter);
app.use('api/auth', authRouter);

// app.use('/api/users', require('./routes/api/users'));
// app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/profile', require('./routes/api/profile'));
// app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
