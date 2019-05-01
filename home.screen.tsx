import React, { PureComponent } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationScreenProp } from "react-navigation";

interface Props {
	navigation: NavigationScreenProp<{}, {}>;
}

class HomeScreen extends PureComponent<Props> {
	render() {
		return (
			<View style={styles.container}>
				<Text>HOME</Text>
				<Button title={"Open Modal"} onPress={() => this.props.navigation.navigate("Detail")} />
			</View>
		);
	}
}

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF"
	},
	welcome: {
		fontSize: 20,
		textAlign: "center",
		margin: 10
	},
	instructions: {
		textAlign: "center",
		color: "#333333",
		marginBottom: 5
	}
});
