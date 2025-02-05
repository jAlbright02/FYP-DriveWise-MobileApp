import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name='Home'/>
      <Stack.Screen name='Dashboard'/>
      <Stack.Screen name='Logs'/>
      <Stack.Screen name='Record'/>
    </Stack>
  );
}
