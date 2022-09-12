import { config } from 'dotenv';
import fs from 'fs';
import http from 'http';
import https from 'https';
import express from 'express';
import cookieParser from 'cookie-parser';
import { rootPathMiddleware } from './middleware/rootPath';
import { writeLog, writeError } from '@root/log';
import mongoose from 'mongoose';
import { getENV } from './utils/env';

config();
const privateKey = fs.readFileSync('./sslcert/key.pem', 'utf8');
const certificate = fs.readFileSync('./sslcert/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpServer = http.createServer(
  express().use('*', (req, res) => {
    res.redirect('https://' + req.headers.host + req.url);
  })
);
const app = express();
const httpsServer = https.createServer(credentials, app);

app.use(express.json());
app.use(cookieParser());
app.get('/', rootPathMiddleware);
app.use(express.static('build/client'));
app.use((req, res) => {
  res.status(404).send('Page not found! Go to <a href="/">Main page</a>');
});

const user = getENV('MONGO_USERNAME_FILE');
const pass = getENV('MONGO_PASSWORD_FILE');

async function startApp() {
  try {
    httpServer.listen(80);
    httpsServer.listen(443);

    await mongoose.connect(`mongodb://${user}:${pass}@mongo:27017/`);

    writeLog('App successfully started.');
  } catch (err) {
    writeError(__dirname, err);
  }
}

startApp();
