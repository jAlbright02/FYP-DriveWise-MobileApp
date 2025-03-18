import { Text, View, StyleSheet, FlatList, Pressable} from "react-native";
import { parseTextFile, getLogNames } from "../utils/awsUtils";
import React, { useState, useEffect } from 'react';

export default function travelLogs() {
  const [fileContent, setFileContent] = useState(null);
  const [logNames, setLogNames] = useState([]);
  
useEffect(() => {

  const fetchNames = async () => {
    try {
      const logNamesList = await getLogNames();
      setLogNames(logNamesList);
    } catch (err) {
      console.error('Couldn\'t fetch logs: ', err)
    }
  }

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
  fetchNames();
}, []);

  return (
    <View style={styles.container}>
      <Text>Logs</Text>
        <FlatList
          data={logNames}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable>
              <View style={styles.itemContainer}>
                <Text>{item}</Text>
              </View>
            </Pressable>
          )}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    padding: 10,
    margin: 5,
    backgroundColor: 'grey',
    borderRadius: 5,
  }
});
