import express, { Express } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import productsRoutes from './routes/products/products-routes.js';
import { resetStockJob } from './lib/jobs.js';
import { dailyLimiter } from './lib/rate-limit.js';
import helmet from 'helmet';
import morgan from 'morgan';
import { readmeController } from './controllers/readme-controller.js';

// env
config();

// cron jobs
resetStockJob();

const app: Express = express();

// middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(dailyLimiter);
app.use(helmet());

// routes
app.get('/', readmeController);
app.use('/v1', productsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
