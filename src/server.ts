import Hapi from '@hapi/hapi';
import Dotenv from 'dotenv';
import { join as PathJoin } from 'path';
import vision from '@hapi/vision'; // Pengganti express.use("view", "ejs")
import inert from '@hapi/inert'; // Pengganti express.static("public")
import { routes } from './routes/index';

// Setup Env File
Dotenv.config({ path: PathJoin(__dirname + '/src/config/.env') });

// Setup
const host = '0.0.0.0';
const port = process.env.PORT || 5700;

// Create Init API Server
const init = async () => {
    const server = Hapi.server({
        port: Number(port),
        host: host,
    });

    // Register plugins
    await server.register([
        inert,
        vision
    ]);

    // Route untuk melayani features
    server.route(routes);

    // Route untuk melayani file statis
    server.route({
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: PathJoin(__dirname, '/public'),
                redirectToSlash: true,
                index: true,
            },
        },
    });

    // Start server
    await server.start();
    console.log(`Server is running on ${ server.info.uri }`);
};

init();