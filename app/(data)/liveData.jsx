import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import mqtt from 'mqtt';

//add this back for eas into the package.json
//remove for local expo go dev work
//"expo-dev-client": "~5.0.12",


const host = 'wss://industrial.api.ubidots.com:8084/mqtt';
const username = 'BBUS-zGQixkb8LkvxAtRiqYV5alMn1qcit8';
const topicStr = '/v1.6/devices/drivewise/';
const topics = [topicStr + 'speed', topicStr + 'rpm', topicStr + 'engload'];

const options = {
  keepalive: 60,
  clientId: '67b9e66f39cee13aef369e0b',
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
  const [data, setData] = useState({speed: 0, rpm: 0, engineLoad: 0});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = mqtt.connect(host, options);

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected');
      socket.subscribe(topics);
    });

    socket.on('message', (topic, message) => {
      console.log('Raw message:', message.toString());
      try {
        const mqttData = JSON.parse(message.toString());
        const topicSplit = topic.split('/');
        const topicName = topicSplit[topicSplit.length-1];

        switch (topicName) {
          case 'speed':
            setData((prevData) => ({ ...prevData, speed: mqttData.value }));
            break;
          case 'rpm':
            setData((prevData) => ({ ...prevData, rpm: mqttData.value }));
            break;
          case 'engload':
            setData((prevData) => ({ ...prevData, engineLoad: mqttData.value }));
            break;
          default:
            console.warn('Unknown variable:', topicName);
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
