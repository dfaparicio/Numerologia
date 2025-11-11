import express from 'express';
import cors from 'cors';
import lecturasRoutes from './routes/lecturasroutes.js';
import pagosRoutes from './routes/pagosroutes.js';
import usuariosRoutes from './routes/usuariosroutes.js';
import 'dotenv/config';


const app = express();
app.use(cors());
app.use(express.json());


app.use(lecturasRoutes);
app.use(pagosRoutes);
app.use(usuariosRoutes);


const PORT = 5040;
app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));
