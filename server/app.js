import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import userClientRoutes from './routes/userClientRoute.js'
import locationRoutes from './routes/locationRoute.js'
import oauthRoutes from "./routes/oauthRoutes.js";
import categoryRoutes from "./routes/categoryRoute.js"
import businessListRoutes from "./routes/businessListRoute.js"
import rolesRoutes from "./routes/rolesRoutes.js"

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URL

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(userRoutes);
app.use(oauthRoutes);
app.use(userClientRoutes);
app.use(locationRoutes);
app.use(categoryRoutes);
app.use(businessListRoutes);
app.use(rolesRoutes)

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected ✅'))
  .catch((err) => console.log('Database connection error ❌', err));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} 🚀`);
});
