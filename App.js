import React from 'react';
import { SemBarreiras } from './src/routes/router';
import * as Font from 'expo-font';
import fonts from './src/assets/fonts/fontlist';
import { PaperProvider } from 'react-native-paper';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';


export default function App() {
  const [fontsLoaded, fontError] = Font.useFonts(fonts);

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PaperProvider onLayout={onLayoutRootView} theme={{dark: false}}>
      <SemBarreiras />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
