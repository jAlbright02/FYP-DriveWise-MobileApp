import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen name="index" options={{title: 'Home'}}></Stack.Screen>
    <Stack.Screen name="(data)" options={{headerShown: false}}></Stack.Screen>
    <Stack.Screen name="(record)" options={{headerShown: false}}></Stack.Screen>
  </Stack>
);
}
