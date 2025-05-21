import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = new Storage({
  keyFilename: path.join(__dirname, '../gcsServiceAccount.json'),
});

const bucket = storage.bucket('spotdraft_bucket');

export default bucket;
