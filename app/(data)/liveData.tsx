import { Text, View, StyleSheet} from "react-native";
import React, {useState, useEffect} from "react";

interface carData {
  speed: number;
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
      <Text>Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
    
      <Text>Data: {data ? (
        <>
          <Text>Speed: {data.speed}</Text>
        </>
      ):
       (
        <>
          <Text>No data received yet...</Text>
        </>
       )}</Text>
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
