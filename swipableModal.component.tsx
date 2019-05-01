import React, { PureComponent, Component } from "react";
import {
	Animated,
	PanResponder,
	Easing,
	PanResponderGestureState,
	PanResponderInstance,
	View,
	Text,
	StyleSheet,
	Dimensions
} from "react-native";

interface Props {
	nearTop: boolean;
	nearBottom: boolean;
	onClose: () => void;
	children?: React.ReactNode;
}

interface State {
	pan: Animated.ValueXY;
	gesture?: PanResponderGestureState;
	isDragging: boolean;
}

const { height: screenHeight } = Dimensions.get("window");
const TIMING_CONFIG = { duration: 300, easing: Easing.inOut(Easing.ease) };

class SwipableModal extends PureComponent<Props, State> {
	panResponder: PanResponderInstance;

	constructor(props: Props) {
		super(props);
		this.state = {
			pan: new Animated.ValueXY({ x: 0, y: 0 }),
			isDragging: false
		};

		this.panResponder = PanResponder.create({
			// Ask to be the responder:
			onStartShouldSetPanResponder: () => false,
			onStartShouldSetPanResponderCapture: () => false,
			onMoveShouldSetPanResponderCapture: () => false,
			onPanResponderTerminationRequest: () => false,

			onMoveShouldSetPanResponder: (evt, gestureState) => {
				if (this.state.isDragging) {
					return true;
				}

				// moving finger from top to bottom
				if (gestureState.vy > 0 && this.props.nearTop) {
					this.setState({ isDragging: true });
					return true;
				}

				// moving finger from bottom to top
				if (gestureState.vy < 0 && this.props.nearBottom) {
					this.setState({ isDragging: true });
					return true;
				}

				return false;
			},
			onPanResponderMove: (evt, gestureState) => {
				this.state.pan.setValue({ x: 0, y: gestureState.dy });
			},
			onPanResponderRelease: (evt, gestureState) => {
				this.setState({ isDragging: false });
				if (gestureState.vy <= -0.7 || gestureState.dy <= -300) {
					// move from bottom to top
					Animated.timing(this.state.pan, {
						toValue: { x: 0, y: -screenHeight },
						...TIMING_CONFIG
					}).start(this.closeModal);
				} else if (gestureState.vy >= 0.5 || gestureState.dy >= 300) {
					// move from top to
					Animated.timing(this.state.pan, {
						toValue: { x: 0, y: screenHeight },
						...TIMING_CONFIG
					}).start(this.closeModal);
				} else {
					Animated.spring(this.state.pan, {
						toValue: 0
					}).start();
				}
			}
		});
	}

	closeModal = () => {
		this.props.onClose();
	};

	handleGetStyle() {
		return [
			style.container,
			{
				transform: [...this.state.pan.getTranslateTransform()]
			}
		];
	}

	render() {
		return (
			<Animated.View style={this.handleGetStyle()} {...this.panResponder.panHandlers}>
				{this.props.children}
			</Animated.View>
		);
	}
}

export default SwipableModal;

const style = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white"
	}
});
