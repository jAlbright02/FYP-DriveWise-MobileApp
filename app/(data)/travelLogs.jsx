import { Text, View, StyleSheet} from "react-native";
import { parseTextFile } from "../utils/awsUtils";
import React, { useState, useEffect } from 'react';

export default function travelLogs() {
  const [fileContent, setFileContent] = useState(null);
  
useEffect(() => {
  const fetchFile = async () => {
    try {
      const content = await parseTextFile('hw.txt');
      setFileContent(content);
    } catch (err) {
      console.error('Failed to fetch: ', err);
      setFileContent('Failed to load file');
    }
  };
  fetchFile();
}, []);

  return (
    <View style={styles.container}>
      <Text>Logs</Text>
      <Text>{fileContent || 'Loading...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
