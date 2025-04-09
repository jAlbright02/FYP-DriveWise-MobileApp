import { Text, View, StyleSheet, Dimensions } from "react-native";
import { useState, useEffect, useRef } from "react";
import { writeCSV } from "../utils/fileHandler.js";
import { getLocation } from "../utils/locationUtils.js";
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
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

//add this back for eas into the package.json
//remove for local expo go dev work
//"expo-dev-client": "~5.0.12",

//init for connecting to ubidots and storing the information
const host = 'wss://industrial.api.ubidots.com:8084/mqtt';
const username = 'BBUS-2pKVH91JG2LEz2pPnx1rfGdLATyydA';
const topicStr = '/v1.6/devices/drivewise/';
const topics = [topicStr + 'speed', topicStr + 'rpm', topicStr + 'engload', topicStr + 'engcooltemp',
                topicStr + 'mass_af', topicStr + 'fuel_lvl', topicStr + 'ambtemp', topicStr + 'man_press', topicStr + 'bar_press'];   

let carValues = {speed: 0, rpm: 0, engineLoad: 0, engCoolTemp: 0, mass_af: 0, fuel_lvl: 0, ambtemp: 0, man_press: 0, bar_press: 0}

const options = {
  keepalive: 60,
  clientId: '67e17bdde4af5d331b994444',
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
  const [client, setClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  //functions for swiping between pages
  const screenWidth = Dimensions.get('window').width;
  const translateX = useSharedValue(0);

  const onGestureEvent = (event) => {
    const { translationX } = event.nativeEvent;
    translateX.value = -currentPage * screenWidth + translationX;
  };
  
  const onGestureEnd = (event) => {
    const { translationX, velocityX } = event.nativeEvent;
    
    const swipeThreshold = screenWidth * 0.3;
    const swipeVelocityThreshold = 500;
    
    const shouldSwipeLeft = 
      (translationX < -swipeThreshold || velocityX < -swipeVelocityThreshold) && 
      currentPage === 0;
      
    const shouldSwipeRight = 
      (translationX > swipeThreshold || velocityX > swipeVelocityThreshold) && 
      currentPage === 1;
  
    if (shouldSwipeLeft) {
      setCurrentPage(1);
      translateX.value = withSpring(-screenWidth);
    } else if (shouldSwipeRight) {
      setCurrentPage(0);
      translateX.value = withSpring(0);
    } else {
      translateX.value = withSpring(-currentPage * screenWidth);
    }
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: screenWidth * 2,
    };
  });

  //want useRef for these values as we want to access them within the component, if useState is used we won't see an updated
  //value until the component mounts again (no use to us then)
  let logData = useRef({});
  let cnt = useRef({s:0, r:0, eL: 0, eT:0, maf:0, flvl:0, amtem:0, bar:0, man:0});
  let speedLim = useRef(0);
  let prevVals = useRef({maf:0, amtem:0, bar:0, man:0})
  const isFirstIteration = useRef(true);

  useEffect(() => {
    const getSpeedOnInit = async () => {
      const limit = await getLocation();
      speedLim.current = limit;
      console.log("Initial speed limit fetched:", limit);
    };
    getSpeedOnInit();

    let mqttClient = null;
    if (!client) {
      mqttClient = mqtt.connect(host, options);
      setClient(mqttClient);

      mqttClient.on('connect', () => {
        setIsConnected(true);
        console.log('Connected');
        mqttClient.subscribe(topics);
      });

      mqttClient.on('message', (topic, message) => {
        try {
          //strip back the string in topic to get the actual topic name we are subscribed to
          const mqttData = JSON.parse(message.toString());
          const topicSplit = topic.split('/');
          const topicName = topicSplit[topicSplit.length-1];

          switch (topicName) {
            //check the case
            //setData to new value if its changed, if not leave as the same
            //set the ref for each topic value, increment count to keep track of data received
            case 'speed': 
              setData((prevData) => ({ ...prevData, speed: mqttData.value }));
              logData.current.speed = mqttData.value;
              ++cnt.current.s;
              break;
            case 'rpm': 
              setData((prevData) => ({ ...prevData, rpm: mqttData.value }));
              logData.current.rpm = mqttData.value;
              ++cnt.current.r; 
              break;
            case 'engload':
              setData((prevData) => ({ ...prevData, engineLoad: mqttData.value }));
              logData.current.engineLoad = mqttData.value;
              ++cnt.current.eL;
              break;
            case 'engcooltemp':
              setData((prevData) => ({ ...prevData, engCoolTemp: mqttData.value }));
              logData.current.engCoolTemp = mqttData.value;
              ++cnt.current.eT;
              break;
            case 'mass_af':
              setData((prevData) => ({ ...prevData, mass_af: mqttData.value}));
              logData.current.mass_af = mqttData.value;
              ++cnt.current.maf;
              break;
            case 'fuel_lvl':
              setData((prevData) => ({ ...prevData, fuel_lvl: mqttData.value}));
              logData.current.fuel_lvl = mqttData.value;
              ++cnt.current.flvl;
              break;
            case 'ambtemp':
              setData((prevData) => ({ ...prevData, ambtemp: mqttData.value }));
              logData.current.ambtemp = mqttData.value;
              ++cnt.current.amtem;
              break;
            case 'bar_press':
              setData((prevData) => ({ ...prevData, bar_press: mqttData.value }));
              logData.current.bar_press = mqttData.value;
              ++cnt.current.bar;
              break;
            case 'man_press':
              setData((prevData) => ({ ...prevData, man_press: mqttData.value }));
              logData.current.man_press = mqttData.value;
              ++cnt.current.man;
              break;
            default: console.warn('Unknown variable:', topicName);
          }

          //check we have our first run
          if (isFirstIteration.current) {
            if (Object.values(cnt.current).every(value => value > 0)) {
              console.log("All data received");
              isFirstIteration.current = false;
            }
          } else { //check that we have incremented the main 3 topics once, push data to csv and reset
            if (cnt.current.s > 0 && cnt.current.r > 0 && cnt.current.eL > 0) {
              console.log("Data ready for CSV:", logData);
              writeCSV(logData.current, speedLim.current);
              cnt.current.s = 0;
              cnt.current.r = 0;
              cnt.current.eL = 0;
            }
          }

        } catch (error) {
          console.error('Error parsing message:', error);
        }     

      });

      mqttClient.on('error', (error) => {
        console.error('Connection error:', error);
      });

      mqttClient.on('close', () => {
        setIsConnected(false);
        console.log('WebSocket connection closed');
      });
  }

  const speedLimInterval = setInterval(async () => {
    console.log('Getting speed limit');
    speedLim.current = await getLocation();
  }, 180000);

    return () => {
      //cleaner handling of connection close
      if (mqttClient) {
        console.log('Cleaning up MQTT connection...');
        mqttClient.unsubscribe(topics, () => {
          console.log('Unsubscribed from topics');
          mqttClient.end(true, () => {
            console.log('MQTT connection closed');
            setClient(null);
            setIsConnected(false);
          });
        });
      }
      clearInterval(speedLimInterval);
    };
  }, []);

  const getChangeIndicator = (newValue, oldValue) => {
    if (newValue > oldValue) {
      return <FontAwesome name="arrow-up" size={20} color="green" />;
    } else if (newValue < oldValue) {
      return <FontAwesome name="arrow-down" size={20} color="red" />;
    }
    return <Text>-</Text>;
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>

        <View style={styles.paginationIndicator}>
          <View style={[styles.dot, currentPage === 0 ? styles.activeDot : null]} />
          <View style={[styles.dot, currentPage === 1 ? styles.activeDot : null]} />
        </View>

        <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onGestureEnd}>
          <Animated.View style={[styles.pagesContainer, animatedStyle]}>
            {/* First Page */}
            <View style={styles.page}>
              <View style={styles.linkCont}>
                  {/* Speed speedo */}
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

                  {/* RPM speedo */}
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
              </View>

              <View style={styles.linkCont}>
                  {/* Engine Load speedo */}
                  <View style={styles.speedoContainer}>
                    <Text style={styles.speedoTitle}>Engine Load (%)</Text>
                    <Speedometer value={data.engineLoad} fontFamily="squada-one" max={100} height={180} width={180}>
                      <Background />
                      <Arc />
                      <Needle />
                      <Progress />
                      <Marks fontSize={15} />
                      <Indicator fontSize={20} />
                    </Speedometer>
                  </View>

                  {/* Fuel Gauge speedo */}
                  <View style={styles.speedoContainer}>
                    <Text style={styles.speedoTitle}>Fuel Level</Text>
                    <Speedometer value={data.fuel_lvl} fontFamily="squada-one" max={100} rotation={-120} angle={240} height={180} width={180}>
                      <Background />
                      <Arc />
                      <Needle />
                      <DangerPath offset={170} angle={60}/>
                      <Progress arcWidth={8} />
                      <Marks step={5} fontSize={15} />
                      <Indicator fontSize={20}/>
                    </Speedometer>
                  </View>
              </View>

              <View style={styles.linkCont}>

                  {/* Eng Temp speedo */}
                  <View style={styles.speedoContainer}>
                    <Text style={styles.speedoTitle}>Engine Temp (°C)</Text>
                    <Speedometer value={data.engCoolTemp} fontFamily="squada-one" max={120} height={180} width={180}>
                      <Background />
                      <Arc />
                      <Needle />
                      <Progress />
                      <DangerPath angle={30}/>
                      <Marks fontSize={15} step={30}/>
                      <Indicator fontSize={20} />
                    </Speedometer>
                  </View>
              </View>

            </View>

            {/*Second Page*/}
            <View style={styles.page}>
              <Text style={styles.pageTitle}>Additional Data</Text>
              {/* Manifold Pressure */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Manifold Pressure (hPa)</Text>
                <Text style={styles.cardValue}>{data.man_press} hPa</Text>
                <View style={styles.indicator}>
                  {getChangeIndicator(data.man_press, 1)}
                </View>
              </View>

              {/* Barometric Pressure */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Barometric Pressure (hPa)</Text>
                <Text style={styles.cardValue}>{data.bar_press} hPa</Text>
                <View style={styles.indicator}>
                  {getChangeIndicator(data.bar_press, 1)}
                </View>
              </View>

              {/* Ambient Temperature */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Ambient Temperature (°C)</Text>
                <Text style={styles.cardValue}>{data.ambtemp} °C</Text>
                <View style={styles.indicator}>
                  {getChangeIndicator(data.ambtemp, 1)}
                </View>
              </View>

              {/* Mass Airflow */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Mass Airflow (g/s)</Text>
                <Text style={styles.cardValue}>{data.mass_af} g/s</Text>
                <View style={styles.indicator}>
                  {getChangeIndicator(data.mass_af, 1)}
                </View>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCEAF7',
    paddingTop: 10,
  },
  headerText: {
    fontFamily: "Roboto",
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  paginationIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
  pagesContainer: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width * 2,
  },
  page: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 10,
  },
  pageTitle: {
    fontFamily: "Roboto",
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  linkCont: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  speedoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  speedoTitle: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cardTitle: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardValue: {
    fontFamily: "Roboto",
    fontSize: 16,
    marginBottom: 5,
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});