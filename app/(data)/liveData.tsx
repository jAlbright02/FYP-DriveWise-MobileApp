import { Text, View, StyleSheet} from "react-native";
import React, {useState, useEffect} from "react";

interface carData {
  speed: number;
  rpm: number;
  engineLoad: number;
}

export default function liveData() {
  const [data, setData] = useState<carData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      setIsConnected(true);
      console.log('Connected');
    };

    socket.onmessage = (event) => {
      const incData = JSON.parse(event.data);
      setData(incData);
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
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
