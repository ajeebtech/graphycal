import express from 'express';
import cors from 'cors';
import routes from './routes';
import { getDb } from './db';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Initialize DB on startup
getDb().then(() => {
    console.log('Database initialized');
}).catch(err => {
    console.error('Failed to initialize database:', err);
});

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
