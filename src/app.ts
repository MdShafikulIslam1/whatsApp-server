import express from 'express';
import cors from 'cors';
const app = express();

//parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'successfully working Express Backend setup Application',
  });
});

export default app;
