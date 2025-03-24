import { Stack } from "expo-router";
import { RecordingProvider } from "./context/RecordingContext.js";

export default function RootLayout() {
  return (
    <RecordingProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="(data)" options={{ headerShown: false }} />
        <Stack.Screen name="(record)" options={{ headerShown: false }} />
      </Stack>
    </RecordingProvider>
  );
}
