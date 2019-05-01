import React, { PureComponent } from "react";
import { StyleSheet, Text, View, Button, NativeSyntheticEvent, NativeScrollEvent, Animated } from "react-native";
import { NavigationScreenProp, ScrollView } from "react-navigation";
import SwipableModal from "./swipableModal.component";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

interface Props {
	navigation: NavigationScreenProp<{}, {}>;
}

interface State {
	closeToBottom: boolean;
	closeToTop: boolean;
}

class DetailScreen extends PureComponent<Props> {
	state = {
		closeToTop: true,
		closeToBottom: false
	};

	scrollY = new Animated.Value(0);
	scrollView?: ScrollView;

	handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const closeToTop = this.isCloseToTop(e);
		if (closeToTop !== this.state.closeToTop) {
			this.setState({ closeToTop });
		}

		const closeToBottom = this.isCloseToBottom(e);
		if (closeToBottom !== this.state.closeToBottom) {
			this.setState({ closeToBottom });
		}
	};

	isCloseToTop = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { contentOffset } = e.nativeEvent;

		return contentOffset.y === 0;
	};

	isCloseToBottom = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
		return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
	};

	renderContent = () => {
		return (
			<Animated.ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				scrollEventThrottle={16}
				bounces={false}
				// scrollEnabled={false}
				overScrollMode={"never"}
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: {
									y: this.scrollY
								}
							}
						}
					],
					{
						useNativeDriver: true,
						listener: this.handleScroll
					}
				)}
				ref={(ref: any) => (this.scrollView = ref && ref.getNode())}>
				<TouchableWithoutFeedback>
					<View style={{flex: 1}}>
						<View style={{...styles.container, height: 200, backgroundColor: "red"}}>
							<Text>red</Text>
						</View>
						<View style={{ ...styles.container, height: 200, backgroundColor: "yellow" }}>
							<Text>yellow</Text>
						</View>
						<View style={{ ...styles.container, height: 200, backgroundColor: "green" }}>
							<Text>green</Text>
						</View>
						<View style={{ ...styles.container, height: 200, backgroundColor: "blue" }}>
							<Text>blue</Text>
						</View>
						<View style={{ ...styles.container, height: 200, backgroundColor: "red" }}>
							<Text>red</Text>
						</View>
						<View style={{ ...styles.container, height: 200, backgroundColor: "yellow" }}>
							<Text>yellow</Text>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Animated.ScrollView>
		);
	};

	render() {
		return (
				<SwipableModal
					onClose={this.props.navigation.pop}
					nearTop={this.state.closeToTop}
					nearBottom={this.state.closeToBottom}>
					{this.renderContent()}
				</SwipableModal>
		);
	}
}

export default DetailScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white"
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
