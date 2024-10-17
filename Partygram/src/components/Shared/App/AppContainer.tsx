import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Variables } from "../../../style";

SplashScreen.preventAutoHideAsync();

type Props = {
  children: React.ReactNode;
};

const AppContainer = ({ children }: Props) => {
  const [fontsLoaded] = useFonts({
    [Variables.fonts.default]: require("../../../../assets/fonts/SourceSansPro-Regular.ttf"),
    [Variables.fonts.bold]: require("../../../../assets/fonts/SourceSansPro-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      const hide = async () => {
        await SplashScreen.hideAsync();
      };
      hide();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return children;
};

export default AppContainer;
