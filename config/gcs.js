import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
dotenv.config();

//for local
// const credentials = process.env.GOOGLE_CREDENTIALS;
// const storage = new Storage({ credentials });

//for deploy
const storage = new Storage({
  keyFilename: '/etc/secrets/gcp-key.json',
});

const bucket = storage.bucket('spotdraft_bucket');

export default bucket;
