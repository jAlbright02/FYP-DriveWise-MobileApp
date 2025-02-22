import { Text, View, StyleSheet} from "react-native";

export default function travelLogs() {
  return (
    <View style={styles.container}>
      <Text>Logs</Text>
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
