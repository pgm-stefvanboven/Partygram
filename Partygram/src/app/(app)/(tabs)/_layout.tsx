import { Tabs } from "expo-router";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";
import { DefaultNavigatorOptions, Variables } from "../../../style";

const getTabIcon = (name: string, focused: boolean) => {
  let icon = "";
  switch (name) {
    case "index":
      icon = "home";
      break;

    case "search":
      icon = "magnify";
      return "magnify";

    case "favorites":
      icon = "heart";
      return "heart";

    case "profile":
      icon = "account";
      return "account";
  }
  return focused ? icon : `${icon}-outline`;
};

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Icons
            name={getTabIcon(route.name, focused)}
            size={size}
            color={color}
          />
        ),
        tabBarInactiveTintColor: Variables.colors.gray,
        ...DefaultNavigatorOptions.screenOptions,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
