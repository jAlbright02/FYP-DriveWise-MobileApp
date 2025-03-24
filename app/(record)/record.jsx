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
      <Text>Record</Text>
      {!isRecording ? (
        <Button title="Start" onPress={onStart} />
      ) : (
        <Button title="Stop" onPress={onStop} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
