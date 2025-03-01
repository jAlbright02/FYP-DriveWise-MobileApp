import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { awsConfig } from './awsConfig';

const s3Client = new S3Client({
    region:awsConfig.region,
    credentials: {
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
    },
  });

export async function parseTextFile(fileName) {
    try {
      const command = new GetObjectCommand({
        Bucket: awsConfig.bucket,
        Key: `logs/${fileName}`,
      });
  
      const data = await s3Client.send(command);
  
      const body = data.Body;
      const stream = body?.transformToString();
  
      const fileContent = await stream;
      return fileContent;
    } catch (error) {
      console.error('Error fetching or parsing file:', error);
    }
}