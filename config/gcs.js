import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
dotenv.config();

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const storage = new Storage({ credentials });

const bucket = storage.bucket('spotdraft_bucket');

export default bucket;
