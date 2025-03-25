import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect, useRef } from "react";
import { writeCSV } from "../utils/fileHandler.js";
import mqtt from 'mqtt';

//add this back for eas into the package.json
//remove for local expo go dev work
//"expo-dev-client": "~5.0.12",


const host = 'wss://industrial.api.ubidots.com:8084/mqtt';
const username = 'BBUS-2pKVH91JG2LEz2pPnx1rfGdLATyydA';
const topicStr = '/v1.6/devices/drivewise/';
const topics = [topicStr + 'speed', topicStr + 'rpm', topicStr + 'engload', topicStr + 'engcooltemp',
                topicStr + 'mass_af', topicStr + 'fuel_lvl', topicStr + 'ambtemp', topicStr + 'man_press', topicStr + 'bar_press'];

const EXPECTED_PARAMS = new Set ([
  'speed', 'rpm', 'engineLoad', 'engCoolTemp',
  'mass_af', 'fuel_lvl', 'ambtemp', 'man_press', 'bar_press'
]);                

let carValues = {speed: 0, rpm: 0, engineLoad: 0, engCoolTemp: 0, mass_af: 0, fuel_lvl: 0, ambtemp: 0, man_press: 0, bar_press: 0}

const options = {
  keepalive: 60,
  clientId: '67e17bdde4af5d331b993744',
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
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
  const dataRef = useRef({...carValues});
  const receivedParams = useRef(new Set());

  useEffect(() => {
    const socket = mqtt.connect(host, options);

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected');
      socket.subscribe(topics);
    });

    socket.on('message', (topic, message) => {
      try {
        const mqttData = JSON.parse(message.toString());
        const topicSplit = topic.split('/');
        const topicName = topicSplit[topicSplit.length-1];

        receivedParams.current.add(topicName);
        setData((prevData) => {
          // Update the data ref FIRST
          const newData = {...prevData};
          switch (topicName) {
            case 'speed': newData.speed = mqttData.value; break;
            case 'rpm': newData.rpm = mqttData.value; break;
            case 'engload': newData.engineLoad = mqttData.value; break;
            case 'engcooltemp': newData.engCoolTemp = mqttData.value; break;
            case 'mass_af': newData.mass_af = mqttData.value; break;
            case 'fuel_lvl': newData.fuel_lvl = mqttData.value; break;
            case 'ambtemp': newData.ambtemp = mqttData.value; break;
            case 'bar_press': newData.bar_press = mqttData.value; break;
            case 'man_press': newData.man_press = mqttData.value; break;
            default: console.warn('Unknown variable:', topicName);
          }

          // Keep ref in sync
          dataRef.current = newData;

          // Check if we have all expected parameters
          if (EXPECTED_PARAMS.size === receivedParams.current.size && 
              [...EXPECTED_PARAMS].every(p => receivedParams.current.has(p))) {
            writeCSV(dataRef.current);
            receivedParams.current.clear(); 
          }

          return newData;
        });
      
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
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
      <Text style={styles.headerText}>Data Retrieved</Text>
      <View style={styles.linkCont}>
        {data ? (
          <>
            <Text style={styles.dataText}>Speed: {data.speed}</Text>
            <Text style={styles.dataText}>RPM: {data.rpm}</Text>
            <Text style={styles.dataText}>Load: {data.engineLoad}</Text>
            <Text style={styles.dataText}>Engine Coolant Temp: {data.engCoolTemp}</Text>
            <Text style={styles.dataText}>Mass Air Flow: {data.mass_af}</Text>
            <Text style={styles.dataText}>Fuel Level: {data.fuel_lvl}</Text>
            <Text style={styles.dataText}>Ambient Temperature: {data.ambtemp}</Text>
            <Text style={styles.dataText}>Manifold Pressure: {data.man_press}</Text>
            <Text style={styles.dataText}>Barometric Pressure: {data.bar_press}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkCont: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20
  },
  dataText: {
    fontSize: 18
  },
});
