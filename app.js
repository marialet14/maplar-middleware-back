import express from 'express';
import cors from 'cors';
import routes from './src/routes/routes.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.get('/teste', (req, res) => res.json({ ok: true }));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor do Maplar rodando na porta: ${PORT}`);
});