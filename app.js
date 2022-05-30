//------ app.js -----//

import express from 'express';
import cors from 'cors'
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import dotenv from 'dotenv';

const app = express();

app.use(express.json());

dotenv.config();

conectarDB();

//********CONFING CORS********//
const urlRequest = [process.env.FRONT_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if(urlRequest.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'))
        }
    },
};

app.use(cors(corsOptions));

//*********ROUTING PRINCIPAL**********//
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

const PORT= process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`El servidor se ha creado corretamente en el puerto ${PORT}`);
});