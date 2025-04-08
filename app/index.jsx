import { Link } from "expo-router";
import { Text, View, Image, StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const imageSize = screenWidth * 0.4;

export default function Index() {
  //https://commons.wikimedia.org/wiki/ for images

  return (
    <View style={styles.container}>
      <Link href="/(data)/liveData">
        <View style={styles.linkCont}>
          <Image style={[styles.images, { width: imageSize, height: imageSize }]} source={require('../assets/images/speedo.png')} />
          <Text style={styles.textStyle}>Live Data</Text>
        </View>
      </Link>

      <View style={styles.spacing} />

      <Link href="/(data)/travelLogs">
        <View style={styles.linkCont}>
          <Image style={[styles.images, { width: imageSize, height: imageSize }]} source={require('../assets/images/logs.png')} />
          <Text style={styles.textStyle}>Logs</Text>
        </View>
      </Link>

      <View style={styles.spacing} />

      <Link href="/(record)/record">
        <View style={styles.linkCont}>
          <Image style={[styles.images, { width: imageSize, height: imageSize }]} source={require('../assets/images/record.png')} />
          <Text style={styles.textStyle}>Record</Text>
        </View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  images: {
    resizeMode: 'contain'
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCEAF7', // Colour used in your poster
    paddingHorizontal: 20,
    paddingTop: screenHeight * 0.02
  },

  linkCont: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: screenHeight * 0.05
  },

  spacing: {
    height: '5%'
  },

  textStyle: {
    padding: 10,
    marginTop: 5,
    textAlign: 'center',
    width: screenWidth * 0.4,
    fontSize: screenWidth * 0.045,
    fontFamily: "Roboto",
    backgroundColor: "#A6CAEC",
    borderRadius: 5,
  },
});
