import * as dotenv from 'dotenv';
import * as express from 'express';
import connectDB from './config/db';
dotenv.config();

const app = express();

// Connect Database
connectDB();

interface Options {
  extended: boolean;
}
// Init MiddleWare
app.use(express.json());

app.get('/', (req, res) => res.send('API Running'));

// // Define ROutes
// app.use('/api/users', require('./routes/api/users'));
// app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/profile', require('./routes/api/profile'));
// app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
