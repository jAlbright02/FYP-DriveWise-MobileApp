import {Text, StyleSheet, View} from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text>Your mom</Text>
    </View>  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});