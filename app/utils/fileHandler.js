import * as FileSystem from 'expo-file-system';
import { DateTime } from 'luxon';
import {uploadCsvToS3} from './awsUtils';

let recording = false;
const todayDate = DateTime.now().toFormat('dd-MM-yyyy-HH-mm');
let fileName = `carData_${todayDate}`
let fileUri = FileSystem.documentDirectory + `${fileName}.csv`;

// Create header if file doesn't exist
const initialiseCSV = async () => {
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  console.log(fileUri);
  if (!fileInfo.exists) {
    await FileSystem.writeAsStringAsync(fileUri, 'Timestamp,Speed,RPM,Engine Load,Engine Coolant Temp,Mass AF,Fuel Level,Ambient Temp,Manifold Press,Barometric Press,Speed Limit\n');
  }
};

// Write data to CSV
export const writeCSV = async (data, speedlimit) => {
  if (!recording) return; // Do nothing if not recording

  const timestamp = DateTime.now().toISO();
  const line = `time:${timestamp},speed:${data.speed},rpm:${data.rpm},engine_load:${data.engineLoad},eng_cool_temp:${data.engCoolTemp},mass_af:${data.mass_af},fuel_lvl:${data.fuel_lvl},ambtemp:${data.ambtemp},man_press:${data.man_press},bar_press:${data.bar_press},speed_limit:${speedlimit}\n`;


  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    await FileSystem.writeAsStringAsync(fileUri, fileContent + line);
  } catch (error) {
    console.error('Error writing to file:', error);
  }
};

export const startRecording = async () => {
  recording = true;
  await initialiseCSV();
};

export const stopRecording = async () => {
  recording = false;

  const fileContent = await FileSystem.readAsStringAsync(fileUri);

  if (fileContent.trim() === 'Timestamp,Speed,RPM,Engine Load,Engine Coolant Temp,Mass AF,Fuel Level,Ambient Temp,Manifold Press,Barometric Press,Speed Limit') {
    console.log('No data to upload, only header present.');
    return;
  }

  try {
    uploadCsvToS3(fileUri, fileName);
  } catch (error) {
    console.error("Error reading the file:", error);
  }
};
