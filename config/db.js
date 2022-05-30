//------ config > db.js -----//

import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        const dbConnection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const url = `${dbConnection.connection.host}:${dbConnection.connection.port}`;

        console.log(`MongoDB conectado en: ${url}`)
    } catch (error) {
        console.log(`Error: ${error.mesagge}`);
        process.exit(1)
    }
}

export default conectarDB;