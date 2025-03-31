import { Link } from "expo-router";
import { Text, View, Image, StyleSheet, TouchableOpacity, Linking} from "react-native";

export default function Index() {
  //https://commons.wikimedia.org/wiki/ for images

  return (
    <View style={styles.container}>
      
      <Link href="/(data)/liveData">
        <View style={styles.linkCont}>
          <Image style={styles.images} source={require('../assets/images/speedo.png')}/>
          <Text style={styles.textStyle}>Live Data</Text>
        </View>
      </Link>
      
      <Link href="/(data)/travelLogs">
        <View style={styles.linkCont}>
          <Image style={styles.images} source={require('../assets/images/logs.png')}/>
          <Text style={styles.textStyle}>Logs</Text>
        </View>
      </Link>

      <Link href="/(record)/record">
        <View style={styles.linkCont}>
          <Image style={styles.images} source={require('../assets/images/record.png')}/>
          <Text style={styles.textStyle}>Record</Text>
        </View>
      </Link>

    </View>
  );
}

const styles = StyleSheet.create({
  images: {
    width: 200,
    height: 200,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCEAF7', //Colour used in my poster 
  },

  linkCont: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textStyle: {
    fontSize: 20,
  },
});
