import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { writeCSV } from "../utils/fileHandler.js";
import mqtt from 'mqtt';
import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
  DangerPath,
} from 'react-native-cool-speedometer';

//add this back for eas into the package.json
//remove for local expo go dev work
//"expo-dev-client": "~5.0.12",


const host = 'wss://industrial.api.ubidots.com:8084/mqtt';
const username = 'BBUS-2pKVH91JG2LEz2pPnx1rfGdLATyydA';
const topicStr = '/v1.6/devices/drivewise/';
const topics = [topicStr + 'speed', topicStr + 'rpm', topicStr + 'engload', topicStr + 'engcooltemp',
                topicStr + 'mass_af', topicStr + 'fuel_lvl', topicStr + 'ambtemp', topicStr + 'man_press', topicStr + 'bar_press'];   

let carValues = {speed: 0, rpm: 0, engineLoad: 0, engCoolTemp: 0, mass_af: 0, fuel_lvl: 0, ambtemp: 0, man_press: 0, bar_press: 0}

const options = {
  keepalive: 60,
  clientId: '67e17bdde4af5d331b993744',
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: false,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  username: username,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  }
};

export default function LiveData() {
  const [data, setData] = useState(carValues);
  const [isConnected, setIsConnected] = useState(false);
  const [isFirstIteration, setIsFirstIteration] = useState(true);

  useEffect(() => {
    const socket = mqtt.connect(host, options);

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected');
      socket.subscribe(topics);
    });

    socket.on('message', (topic, message) => {
      let logData = {};
      let cnt = {s:0, r:0, eL: 0, eT:0, maf:0, flvl:0, amtem:0, bar:0, man:0};

      try {
        const mqttData = JSON.parse(message.toString());
        const topicSplit = topic.split('/');
        const topicName = topicSplit[topicSplit.length-1];

        switch (topicName) {
          case 'speed': setData((prevData) => ({ ...prevData, speed: mqttData.value })); logData.speed = mqttData.value; ++cnt.s; break;
          case 'rpm': setData((prevData) => ({ ...prevData, rpm: mqttData.value })); logData.rpm = mqttData.value; ++cnt.r; break;
          case 'engload': setData((prevData) => ({ ...prevData, engineLoad: mqttData.value })); logData.engineLoad = mqttData.value; ++cnt.eL; break;
          case 'engcooltemp': setData((prevData) => ({ ...prevData, engCoolTemp: mqttData.value })); logData.engCoolTemp = mqttData.value; ++cnt.eT; break;
          case 'mass_af': setData((prevData) => ({ ...prevData, mass_af: mqttData.value })); logData.mass_af = mqttData.value; ++cnt.maf; break;
          case 'fuel_lvl': setData((prevData) => ({ ...prevData, fuel_lvl: mqttData.value })); logData.fuel_lvl = mqttData.value; ++cnt.flvl; break;
          case 'ambtemp': setData((prevData) => ({ ...prevData, ambtemp: mqttData.value })); logData.ambtemp = mqttData.value; ++cnt.amtem; break;
          case 'bar_press': setData((prevData) => ({ ...prevData, bar_press: mqttData.value })); logData.bar_press = mqttData.value; ++cnt.bar; break;
          case 'man_press': setData((prevData) => ({ ...prevData, man_press: mqttData.value })); logData.man_press = mqttData.value; ++cnt.man; break;
          default: console.warn('Unknown variable:', topicName);
        }

        if (isFirstIteration) {
          if (Object.values(cnt).every(value => value > 0)) {
            console.log("All data received");
            setIsFirstIteration(false);
          }
        }
      
        if (!isFirstIteration) {
          if (cnt.s > 0 && cnt.r > 0 && cnt.eL > 0) {
            console.log("Data ready for CSV:", logData);
            cnt.s = 0;
            cnt.r = 0;
            cnt.eL = 0;
          }
        }

      } catch (error) {
        console.error('Error parsing message:', error);
      }     

    });

    socket.on('error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('close', () => {
      setIsConnected(false);
      console.log('WebSocket connection closed');
    });

    return () => {
      socket.end();
    };
  }, [isFirstIteration]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
      <View style={styles.spacing} />
      <View style={styles.linkCont}>
        {data ? (
        <>
        <View style={styles.speedoContainer}>
          <Text style={styles.speedoTitle}>Speed (Km/h)</Text>
          <Speedometer value={data.speed} fontFamily="squada-one" max={200} height={180} width={180}>
            <Background />
            <Arc />
            <Needle />
            <Progress />
            <Marks fontSize={15} />
            <Indicator fontSize={20} />
          </Speedometer>
        </View>
        <View style={styles.spacing} />
        <View style={styles.speedoContainer}>
          <Text style={styles.speedoTitle}>RPM</Text>
          <Speedometer value={data.rpm} fontFamily="squada-one" max={9000} rotation={-90} height={180} width={180}>
            <Background />
            <Arc />
            <Needle />
            <DangerPath />
            <Progress arcWidth={8} />
            <Marks step={1000} fontSize={15} />
            <Indicator fontSize={20}/>
          </Speedometer>
        </View>
        </>
        
        ) : (
          <Text>No data received yet...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: '#DCEAF7', //Colour used in my poster s
  },
  linkCont: {
    flexDirection: 'row', // Change to row to align speedometers side by side
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacing: {
    height: 10,
    width: 20, // Add space between the speedometers
  },
  speedoContainer: {
    alignItems: 'center',
    marginBottom: 20, // Add space between the speedometers
  },
  speedoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5, // Space between title and speedometer
  },
  headerText: {
    fontSize: 20,
  },
  dataText: {
    fontSize: 18,
  },
});