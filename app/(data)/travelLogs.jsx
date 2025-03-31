import { Text, View, StyleSheet, FlatList, Pressable, Modal, ScrollView, Dimensions } from "react-native";
import { parseTextFile, getLogNames } from "../utils/awsUtils";
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function TravelLogs() {
  const [fileContent, setFileContent] = useState(null);
  const [logNames, setLogNames] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const logNamesList = await getLogNames();
        setLogNames(logNamesList);
      } catch (err) {
        console.error('Couldn\'t fetch logs: ', err);
      }
    };

    fetchNames();
  }, []);

  const fetchFile = async (fileName) => {
    try {
      setCurrentFileName(fileName);
      const fileWithExtension = fileName + '.csv'; //Append '.csv' extension to the file name
      const content = await parseTextFile(fileWithExtension);
      setFileContent(content);
    } catch (err) {
      console.error('Failed to fetch file: ', err);
      setFileContent('Failed to load file');
    }
  };

  // Function to view the text in a modal
  const viewContent = (item) => {
    fetchFile(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={logNames}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.itemContainer}>
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{typeof item === 'string' ? item : JSON.stringify(item)}</Text>
              <View style={styles.iconContainer}>
                <Pressable onPress={() => viewContent(item)}>
                  <Icon name="eye" size={20} color="#ffffff" />
                </Pressable>
                <Pressable style={styles.iconSpacing}>
                  <Icon name="bar-chart" size={20} color="#ffffff" />
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>{currentFileName}</Text>
            </View>
            <ScrollView 
              style={styles.scrollViewContent}
              contentContainerStyle={styles.scrollViewContainer}
              horizontal={false}
            >
              <ScrollView horizontal={true}>
                <Text style={styles.logText}>{fileContent}</Text>
              </ScrollView>
            </ScrollView>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#DCEAF7', //Colour used in my poster 
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#A6CAEC', //Colour used in my poster 
    borderRadius: 10,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontFamily: "Roboto",
    fontSize: 18,
    color: 'white', //White text for contrast
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', //transparency
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8, //80% of screen width
    height: height * 0.7, //70% of screen height
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 0,
    overflow: 'hidden', //Prevents content from bleeding outside rounded corners
  },
  modalHeader: {
    backgroundColor: '#A6CAEC',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: "Roboto"
  },
  scrollViewContent: {
    flex: 1,
  },
  scrollViewContainer: {
    padding: 20,
  },
  logText: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'monospace', //Use monospace font for better log/CSV viewing
  },
  closeButton: {
    margin: 15,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#A6CAEC',
    borderRadius: 5,
  },
  closeButtonText: {
    fontFamily: "Roboto",
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
});