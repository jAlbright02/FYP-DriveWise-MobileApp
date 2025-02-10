import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen name="liveData" options={{title: 'Live Data'}}></Stack.Screen>
    <Stack.Screen name="travelLogs" options={{title: 'Logs'}}></Stack.Screen>
  </Stack>
);
}
