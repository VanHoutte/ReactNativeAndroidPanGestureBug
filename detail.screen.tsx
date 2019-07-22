import React, { PureComponent } from "react";
import {
	StyleSheet,
	Text,
	View,
	Button,
	NativeSyntheticEvent,
	NativeScrollEvent,
	Animated,
	Dimensions
} from "react-native";
import { NavigationScreenProp } from "react-navigation";
import SwipeableModal from "./swipeableModal.component";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

// import { PanGestureHandler, ScrollView as GHScrollView, State } from "react-native-gesture-handler";

interface Props {
	navigation: NavigationScreenProp<{}, {}>;
}

interface State {
	closeToBottom: boolean;
	closeToTop: boolean;
	disableScroll: boolean;
}

const { width: screenWidth } = Dimensions.get("window");

class DetailScreen extends PureComponent<Props, State> {
	panGestureHandler = React.createRef();

	// state = {
	// 	topClick: false
	// };

	constructor(props: Props) {
		super(props);

		this._translateX = new Animated.Value(0);
		this._translateY = new Animated.Value(0);
		this._lastOffset = { x: 0, y: 0 };
		this._onGestureEvent = Animated.event(
			[
				{
					nativeEvent: {
						translationX: this._translateX,
						translationY: this._translateY
					}
				}
			],
			{ useNativeDriver: false }
		);
	}

	state = {
		closeToTop: true,
		closeToBottom: false,
		disableScroll: false
	};

	scrollY = new Animated.Value(0);
	// scrollView?: ScrollView;

	handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		console.log(e.nativeEvent.velocity.y);

		const closeToTop = this.isCloseToTop(e);
		if (closeToTop !== this.state.closeToTop) {
			this.setState({ closeToTop });
		}

		if (closeToTop && e.nativeEvent.velocity.y < 0) {
			this.setState({ disableScroll: true });
		} else {
			this.setState({ disableScroll: false });
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
			<View>
				{this.state.closeToTop ? (
					<View
						style={{
							backgroundColor: "blue",
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							height: 300,
							width: screenWidth,
							zIndex: 301
						}}>
						<TouchableWithoutFeedback onPressOut={() => console.log("onPressOut")}>
							<Text>TOP</Text>
						</TouchableWithoutFeedback>
					</View>
				) : null}
				<Animated.ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					scrollEventThrottle={16}
					bounces={false}
					scrollEnabled={!this.state.disableScroll}
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
					<View style={{ flex: 1 }}>
						<View style={{ ...styles.container, height: 200, backgroundColor: "red" }}>
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
				</Animated.ScrollView>
				{this.state.closeToBottom ? (
					<View
						style={{
							backgroundColor: "green",
							position: "absolute",
							bottom: 0,
							left: 0,
							right: 0,
							height: 300,
							width: screenWidth,
							zIndex: 301
						}}>
						<Text>BOTTOM</Text>
					</View>
				) : null}
			</View>
		);
	};

	_touchY = new Animated.Value(0);
	_onPanGestureEvent = Animated.event([{ nativeEvent: { y: this._touchY } }], {
		useNativeDriver: true
	});

	handlePan = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		console.log(e);
	};

	_onHandlerStateChange = (event) => {
		// if (event.nativeEvent.oldState === State.ACTIVE) {
		this._lastOffset.x += event.nativeEvent.translationX;
		this._lastOffset.y += event.nativeEvent.translationY;
		this._translateX.setOffset(this._lastOffset.x);
		this._translateX.setValue(0);
		this._translateY.setOffset(this._lastOffset.y);
		this._translateY.setValue(0);
		// }
	};

	// handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
	// 	this.setState({ closeToTop: this.isCloseToTop(e) });
	// 	this.setState({ closeToBottom: this.isCloseToBottom(e) });
	// };

	// isCloseToTop = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
	// 	const { contentOffset } = e.nativeEvent;

	// 	return contentOffset.y === 0;
	// };

	// isCloseToBottom = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
	// 	const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
	// 	return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
	// };

	getStyle = () => {
		// if (this.state.topClick) {
		transform: [{ translateY: this._translateY }];
		// }
	};

	close = () => {
		this.props.navigation.pop();
	};

	render() {
		return (
			<SwipeableModal onClose={this.close} nearTop={this.state.closeToTop} nearBottom={this.state.closeToBottom}>
				{this.renderContent()}
			</SwipeableModal>

			// <PanGestureHandler
			// 	onGestureEvent={this._onGestureEvent}
			// 	onHandlerStateChange={this._onHandlerStateChange}
			// 	{...this.panGestureHandler}>
			// 	<Animated.View
			// 		style={{
			// 			transform: [...this.state.pan.getTranslateTransform()]
			// 		}}>
			// 		{this.renderContent()}
			// 	</Animated.View>
			// </PanGestureHandler>
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
