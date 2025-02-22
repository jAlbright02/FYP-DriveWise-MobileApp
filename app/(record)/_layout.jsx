import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen name="record" options={{title: 'Record'}}></Stack.Screen>
  </Stack>
);
}
