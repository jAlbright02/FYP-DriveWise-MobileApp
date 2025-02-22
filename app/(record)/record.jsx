import { Text, View, StyleSheet} from "react-native";

export default function record() {
  return (
    <View style={styles.container}>
      <Text>Record</Text>
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
