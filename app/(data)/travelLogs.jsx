import { Text, View, StyleSheet, FlatList, Pressable, Modal, ScrollView } from "react-native";
import { parseTextFile, getLogNames } from "../utils/awsUtils";
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

export default function TravelLogs() {
  const [fileContent, setFileContent] = useState(null);
  const [logNames, setLogNames] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const logNamesList = await getLogNames();
        setLogNames(logNamesList);
      } catch (err) {
        console.error('Couldn\'t fetch logs: ', err);
      }
    };

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

  // Function to view the text content in a modal
  const viewContent = (item) => {
    setSelectedContent(item);
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
            <ScrollView>
              <Text style={styles.modalText}>{selectedContent}</Text>
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
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: 'black',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#A6CAEC',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
});
