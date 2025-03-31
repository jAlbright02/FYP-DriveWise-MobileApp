import * as FileSystem from 'expo-file-system';
import { DateTime } from 'luxon';

let recording = false;
const todayDate = DateTime.now().toFormat('dd-MM-yyyy-HH-mm');
let fileUri = FileSystem.documentDirectory + `carData_${todayDate}.csv`;

// Create header if file doesn't exist
const initializeCSV = async () => {
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  console.log(fileUri);
  if (!fileInfo.exists) {
    await FileSystem.writeAsStringAsync(fileUri, 'Timestamp,Speed,RPM,Engine Load,Engine Coolant Temp,Mass AF,Fuel Level,Ambient Temp,Manifold Press,Barometric Press\n');
  }
};

// Write data to CSV
export const writeCSV = async (data) => {
  if (!recording) return; // Do nothing if not recording

  const timestamp = DateTime.now().toISO();
  const line = `time:${timestamp},speed:${data.speed},rpm:${data.rpm},engine_load:${data.engineLoad},eng_cool_temp:${data.engCoolTemp},mass_af:${data.mass_af},fuel_lvl:${data.fuel_lvl},ambtemp:${data.ambtemp},man_press:${data.man_press},bar_press:${data.bar_press}\n`;


  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    await FileSystem.writeAsStringAsync(fileUri, fileContent + line);
  } catch (error) {
    console.error('Error writing to file:', error);
  }
};

// Start recording
export const startRecording = async () => {
  recording = true;
  await initializeCSV(); // Ensure the CSV file is initialized
};

// Stop recording
export const stopRecording = async () => {
  recording = false;

  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    console.log("CSV File Content:\n", fileContent);
  } catch (error) {
    console.error("Error reading the file:", error);
  }
};
