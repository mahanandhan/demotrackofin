import express from 'express';
import connectDB from './db/connectDB.js';
import dotenv from 'dotenv';
import router from './routes/dataroute.js';
import cors from 'cors';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
const PORT = 5000;

app.get('/', (req, res) => {
    res.send("Welcom to the DemoTrackOfIn backend server!");
})
app.use('/api/data', router);
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});