import { Text, View, StyleSheet} from "react-native";
import {useState, useEffect} from "react";
import mqtt, {IClientOptions} from 'mqtt';

interface carData {
  speed: number;
  rpm: number;
  engineLoad: number;
}

const options: IClientOptions = {
  host: 'ed0971cf75874c3782486469c8aeac41.s1.eu.hivemq.cloud:8884',
  port: 8884,
  protocol: 'wss',
  username: 'test_creds',
  password: 'Test1234'
}

export default function liveData() {
  const [data, setData] = useState<carData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {

    const socket = mqtt.connect(options);

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected');
    });

    socket.on('message', (topic: string, message: Buffer) => {
      const incData: carData = JSON.parse(message.toString());
      setData(incData);
    });

    socket.subscribe('speed');

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
      <View style={styles.linkCont}>{data ? 
      (
        <>
          <Text style={styles.dataText}>Speed: {data.speed}</Text>
          <Text style={styles.dataText}>RPM: {data.rpm}</Text>
          <Text style={styles.dataText}>Load: {data.engineLoad}</Text>
        </>
      ):
      (
        <>
          <Text>No data received yet...</Text>
        </>
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
