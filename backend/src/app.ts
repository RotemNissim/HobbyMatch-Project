import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
