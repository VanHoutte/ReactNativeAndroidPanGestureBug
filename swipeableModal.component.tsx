import React, { PureComponent } from "react";
import { Easing, Platform, Dimensions, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { spring, timing } from "react-native-redash";

const {
	add,
	cond,
	eq,
	event,
	set,
	Value,
	debug,
	and,
	block,
	abs,
	startClock,
	stopClock,
	lessThan,
	Clock,
	divide,
	diff,
	multiply,
	greaterThan,
	sub,
	call,
	or,
	greaterOrEq,
	lessOrEq
} = Animated;

// import { Metrics } from "src/assets/style";
// import style from "./swipeableModal.style";
import { NavigationScreenProp, AnimatedValue } from "react-navigation";
import {
	PanGestureHandler,
	State,
	ScrollView,
	PanGestureHandlerStateChangeEvent,
	PanGestureHandlerGestureEvent
} from "react-native-gesture-handler";

interface Props {
	canScroll: {
		nearTop: boolean,
		nearBottom: boolean
	};
	onClose: (speed: number) => void;
	children?: React.ReactNode;
	nativeScrollRef?: React.RefObject<ScrollView>;
	navigation?: NavigationScreenProp<any, any>;
}

const dismissDistance = Dimensions.get("screen").height / 3;
const screenHeight = Dimensions.get("screen").height;
const TIMING_CONFIG = { duration: 260, easing: Easing.linear };
const minYSwipeDistance = 50;
const minVelocityY = 2000;

class SwipeableModal extends React.Component<Props> {
	panRef = React.createRef<PanGestureHandler>();
	scrollRef = React.createRef<ScrollView>();

	gesture: { y: AnimatedValue };
	trans: { y: AnimatedValue };
	velocity: { y: AnimatedValue };

	state: AnimatedValue;

	_onGestureEvent: (...args: any[]) => void;

	constructor(props: Props) {
		super(props);

		this.gesture = { y: new Value(0) };
		this.velocity = { y: new Value(0) };
		this.state = new Value(-1);

		this._onGestureEvent = event([
			{
				nativeEvent: {
					translationY: this.gesture.y,
					velocityY: this.velocity.y,
					state: this.state
				}
			}
		]);

		this.trans = {
			y: this.interaction(this.gesture.y, this.state, this.velocity.y)
		};
	}

	shouldComponentUpdate() {
		return true;
	}

	interaction = (gestureTranslation, gestureState, velocity) => {
		const dragging = new Value(0);
		const start = new Value(0);
		const position = new Value(0);
		const snapPoint = new Value(0);
		const bottomOutOfScreen = new Value(screenHeight);
		const topOutOfScreen = new Value(-screenHeight);
		const isClosing = new Value(0);

		return block([
			cond(
				eq(gestureState, State.ACTIVE),
				[
					cond(dragging, 0, [set(dragging, 1), set(start, position)]),
					set(position, add(start, gestureTranslation))
				],
				[
					set(dragging, 0),
					set(start, 0),
					cond(
						or(greaterOrEq(position, bottomOutOfScreen), lessOrEq(position, topOutOfScreen)),
						cond(eq(isClosing, 0), [set(isClosing, 1), call([], this.closeModal)])
					),
					cond(
						or(greaterThan(gestureTranslation, dismissDistance), greaterThan(velocity, minVelocityY)),
						[set(position, spring(gestureTranslation, gestureState, bottomOutOfScreen))],
						[
							cond(
								or(lessThan(gestureTranslation, -dismissDistance), lessThan(velocity, -minVelocityY)),
								[set(position, spring(gestureTranslation, gestureState, topOutOfScreen))],
								[set(position, spring(gestureTranslation, gestureState, snapPoint))]
							)
						]
					),
					position
				]
			)
		]);
	};

	closeModal = () => {
		// console.log("CLOSE MODAL 2");
		this.props.onClose(0);
	};

	render() {
		// if (Platform.OS === "android") {
		// 	return this.props.children;
		// }

		return (
			<View style={styles.container}>
				<PanGestureHandler
					ref={this.panRef}
					onGestureEvent={this._onGestureEvent}
					onHandlerStateChange={this._onGestureEvent}>
					<Animated.View
						style={[
							styles.box,
							{
								transform: [{ translateY: this.trans.y }]
							}
						]}>
						{/* {this.props.children} */}
					</Animated.View>
				</PanGestureHandler>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	box: {
		flex: 1,
		backgroundColor: "orange"
	},
	container: {
		flex: 1,
		backgroundColor: "white"
	}
});

export default SwipeableModal;
