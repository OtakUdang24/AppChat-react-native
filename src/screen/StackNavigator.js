import { createStackNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";

import Login from "./Login/Login";
import GroupChat from "./GroupChat/GroupChat";

const AppContainer = createAppContainer(
  createSwitchNavigator({
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
      }
    },
    GroupChat: {
      screen: GroupChat,
      navigationOptions: {
        header: null,
      }
    }
  },{
    initialRouteName: "Login"
  }
  )
);

export default createAppContainer(AppContainer);