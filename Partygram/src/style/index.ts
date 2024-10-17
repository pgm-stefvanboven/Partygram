const Colors = {
  primary: "#23BCB0",
  primary900: "#103646",
  secondary: "#9D4E94",
  gray: "#8D8B88",
  grayLight: "#E5E5E5",
  background: "#EFEFF4",
  white: "#ffffff",
  red: "#DB3B5A",
  red100: "#FFEAEE",
};

const Fonts = {
  default: "source-sans",
  bold: "source-sans-bold",
};

export const Variables = {
  colors: {
    ...Colors,
    text: Colors.primary900,
    lightText: Colors.gray,
    headerText: Colors.white,
    ripple: "rgba(0, 0, 0, 0.1)",
    error: Colors.red,
    errorLight: Colors.red100,
  },
  textSizes: {
    xxxl: 29,
    xxl: 26,
    xl: 23,
    large: 20,
    medium: 18,
    default: 16,
    small: 14.22,
  },
  sizes: {
    xxxxl: 64,
    xxxl: 52,
    xxl: 32,
    xl: 24,
    large: 20,
    medium: 16,
    small: 12,
    xs: 8,
    xxs: 4,
    horizontalPadding: 16,
  },
  fonts: {
    ...Fonts,
  },
};

export const DefaultStyles = {
  colors: {
    ...Variables.colors,
  },
  text: {
    fontSize: Variables.textSizes.default,
    fontFamily: Fonts.default,
    color: Variables.colors.text,
  },
};

export const DefaultNavigatorOptions = {
  screenOptions: {
    tabBarStyle: {
      backgroundColor: Variables.colors.white,
    },
    headerTitleStyle: {
      fontFamily: Fonts.bold,
    },
    headerRightContainerStyle: {
      paddingRight: Variables.sizes.horizontalPadding,
    },
    tabBarLabelStyle: {
      fontFamily: Variables.fonts.bold,
      fontSize: Variables.textSizes.small,
    },
    headerTintColor: Colors.white,
  },
};
