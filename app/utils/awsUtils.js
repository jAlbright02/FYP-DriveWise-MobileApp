import 'react-native-get-random-values'; //polyfill for random value generation as aws-sdk requires crypto.getRandomValues()
import { S3Client, GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import { awsConfig } from './awsConfig';
import * as FileSystem from 'expo-file-system';

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

export async function getLogNames() {
    try {
      const command = new ListObjectsV2Command({
          Bucket: awsConfig.bucket
      });

      const data = await s3Client.send(command);

      const logs = data.Contents
        .map((item) => item.Key.replace('logs/', ''))
        .map((filename) => filename.replace(/\.[^/.]+$/, ''))
        .filter((filename) => filename !== '');


      console.log(logs);

      return logs;
    } catch (error) {
      console.error('Error fetching logs:', error);
      return [];
    }
}

export async function uploadCsvToS3(fileUri, fileName) {
  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8, //read file as UTF-8 string to upload as valid text/csv content to S3
    });
    
    const command = new PutObjectCommand({
      Bucket: awsConfig.bucket,
      Key: `logs/${fileName}.csv`,
      Body: fileContent,
      ContentType: 'text/csv',
    });

    const result = await s3Client.send(command);
    console.log('Successfully uploaded CSV to S3:', fileName);
    return result;
  } catch (error) {
    console.error('Error uploading CSV to S3:', error);
    throw error;
  }
}
