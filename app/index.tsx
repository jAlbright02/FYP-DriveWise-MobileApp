import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <View style={styles.container}>
        <Link href={"/dashboard"} style={styles.linkText}>Dashboard</Link>
        <Link href={"/logs"} style={styles.linkText}>Logs</Link>
        <Link href={"/record"} style={styles.linkText}>Record</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontWeight: 'bold',
  }
});
