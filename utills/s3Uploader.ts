import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config()

// Configure AWS with your credentials
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
});



// Create S3 instance
const s3 = new AWS.S3();

// Handle file upload
const uploadFileToS3 = (file: any): Promise<string> => {
  console.log({ file, bcueckt: process.env.BUCKET_NAME });

  console.log({accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION});
  

  
  const fileName = file.originalFilename;
  const mimeType = file.type;
  const fileStream = fs.createReadStream(file.filepath);

  const params: AWS.S3.Types.PutObjectRequest = {
    Bucket: process.env.BUCKET_NAME || '',
    Key: fileName,
    Body: fileStream,
    ContentType: mimeType,
    ACL: 'public-read' // Adjust the access control as needed
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err: any, data: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location || ''); // URL of the uploaded file
      }
    });
  });
};

export default uploadFileToS3;
