import { Text, View, StyleSheet, Button } from "react-native";
import { startRecording, stopRecording } from "../utils/fileHandler.js";
import { useRecording } from "../context/RecordingContext.js";

export default function Record() {
  const { isRecording, setIsRecording } = useRecording();

  const onStart = () => {
    setIsRecording(true);
    startRecording();
  };

  const onStop = () => {
    setIsRecording(false);
    stopRecording();
  };

  return (
    <View style={styles.container}>
      {!isRecording ? (
        <View style={styles.buttonContainer}>
          <Button title="Start" onPress={onStart} color={'#6BBF59'} />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Stop" onPress={onStop} color={'#E07A5F'} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#DCEAF7' //Colour used in my poster 
  },

  buttonContainer: {
    width: 200,
    height: 50
  },
});
