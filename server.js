import express from 'express'
import matchRouter from './src/routes/matchesRouter.js';
import { attachWebSocketServer } from './src/ws/server.js';
import http from 'http';


const app = express();
const server = http.createServer(app)


const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "Hello from the Express server!" });
});
app.use('/matches',matchRouter)

const {broadcastMatchCreated} = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;


server.listen(PORT,HOST, () => {
	const baseURL = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}${PORT}`;

	console.log(`Server is running on ${baseURL}`);
	console.log(`Websocket server is running on ${baseURL.replace('http','ws')}/ws`);

});
 