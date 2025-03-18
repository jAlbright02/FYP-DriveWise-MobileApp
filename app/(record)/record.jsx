import { Text, View, StyleSheet, Button} from "react-native";

export default function record() {
  return (
    <View style={styles.container}>
      <Text>Record</Text>
      <Button title="Start"/>
      <Button title="Stop"/>
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
