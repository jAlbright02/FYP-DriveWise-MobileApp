import Constants from 'expo-constants';

export const awsConfig = {
  region: Constants.expoConfig.extra.AWS_REGION,
  accessKeyId: Constants.expoConfig.extra.AWS_ACCESS_KEY_ID,
  secretAccessKey: Constants.expoConfig.extra.AWS_SECRET_ACCESS_KEY,
  bucket: Constants.expoConfig.extra.AWS_BUCKET,
};