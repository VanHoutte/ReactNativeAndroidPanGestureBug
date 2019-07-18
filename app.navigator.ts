import { createAppContainer, createStackNavigator, NavigationScreenProp } from "react-navigation";
import HomeScreen from "./home.screen";
import DetailScreen from "./detail.screen";

const RootNavigator = createStackNavigator(
	{
		Home: {
			screen: HomeScreen,
			navigationOptions: {
				header: null
			}
		},
		Detail: {
			screen: DetailScreen,
			navigationOptions: {
				header: null,
				gesturesEnabled: false
			}
		}
	},
	{
		mode: "modal",
		transparentCard: true,
		cardStyle: {
			opacity: 1
		}
		// initialRouteName: "Detail"
	}
);

export default createAppContainer(RootNavigator);
