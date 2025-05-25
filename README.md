# PDF Management and Collaboration System — Backend

This is the backend of a PDF Management & Collaboration Application. The application can be accessed at [spot-draft-task-frontend.vercel.app](spot-draft-task-frontend.vercel.app)
---
Frontend Repo URL: [https://github.com/mirirtiqa/SpotDraftTaskFrontend](https://github.com/mirirtiqa/SpotDraftTaskFrontend)

---
Documentation with API Details: SpotDraft Task API doc.pdf file in the root folder of this repo

## API's

- Login                                                                                           -> protected                                                                    
- Signup                                                                                          -> protected  
- Forgot Password                                                                                 -> protected  
- Reset Password                                                                                  -> protected
- Upload PDF                                                                                      -> protected  
- Get details of all PDFs of a user                                                               -> protected  
- Get details of a single PDF                                                                     -> protected  
- Share PDF                                                                                       -> protected  
- View Shared PDF                                                                                 -> using share token when PDF has been shared
- Get Signed URL of a PDF from Google Cloud Storage                                               -> protected  
- Get Signed URL of a shared PDF from Google Cloud Storage                                        -> using shared token when PDF has been shared  
- Send link where PDF can be viewed using email                                                   -> protected  
- Add a comment by logged in user                                                                 -> protected  
- Add a comment by unauthenticated user when a PDF has been shared                                -> using shared token (for shared pdf)                    
- Get all comments of a PDF                                                                       -> protected  
- Get all comments of a shared PDF                                                                -> using shared token (for shared pdf)

---

## Tech Stack

- Node.js
- Express
- Mongodb
- JWT for authetication and authorization
- Google Cloud Storage for securely storing pdf files
- Nodemailer for sending emails

---

## Installation

### 1. Clone the repo

```bash
git clone https://github.com/mirirtiqa/SpotDraftTaskBackend.git
```

### 2. Install dependencies

```bash
npm install
```

---

## Configuration
Download your json Service Account key from Google Cloud Console. Save it in the root of repo

Create an env in the root and add the following environment variables

```env
// .env 
MONGO_URL = ""
JWT_SECRET= ""
FRONTEND_URL = ""
GOOGLE_APPLICATION_CREDENTIALS="./<FILE_NAME_OF_YOOUR_DOWNLOADED_SERVICE_ACCOUNT_KEY>" 
SMTP_EMAIL=""
SMTP_PASS=""
```
In config/gcs.js file, add the following:
```js
// .js
const credentials = process.env.GOOGLE_CREDENTIALS;
const storage = new Storage({ credentials });
```
And in the same file (config/gcs.js) comment out following (line 10 and line 11):
```js
// .js
const storage = new Storage({
  keyFilename: '/etc/secrets/gcp-key.json',
});
```

## Running the Server

```bash
node server.js
```



Built with 💙 by Irtiqa
