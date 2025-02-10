import { useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, Text, View } from "react-native";
import FlatButton from "../../components/ui/buttons/FlatButton";
import { Colors } from "../../constants/styles";
import Svg, { Circle } from "react-native-svg";
import * as Notifications from 'expo-notifications';

interface RouteParams {
    key: string;
    name: string;
    params: {
        duration: number;
    };
};

function Rest({navigation}: any) {

    const route = useRoute<RouteParams>();
    const { duration } = route.params;

    const [timeLeft, setTimeLeft] = useState(duration);
    const circleSize = useRef(new Animated.Value(1)).current;

    const radius = 100;
    const strokeWidth = 6;
    const circumference = 2 * Math.PI * radius;

    function onTimerEnd() {
        navigation.goBack();
        triggerNotificationHandler();
    }

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimerEnd();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev - 1;
                if (newTime <= 0) return 0;
                return newTime;
            });
        }, 1000);
        
        return () => clearInterval(interval);
    }, [timeLeft]);

    useEffect(() => {
        Animated.timing(circleSize, {
            toValue: 0,
            duration: timeLeft * 1000,
            useNativeDriver: false,
        }).start();
    }, []);

    function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    async function triggerNotificationHandler() {
        try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Time's up'",
                body: 'Time to get back to work !',
                sound: true,
              },
              trigger: null,
            });
          } catch (error) {
            console.log('Error scheduling notification:', error);
          }
    }

    useEffect(() => {
        async function configurePushNotifications() {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert(
              'Permission required',
              'Push notifications need the appropriate permissions.'
            );
            return;
          }
        }
      
        configurePushNotifications();
      }, []);


    return (
        <View style={styles.container}>
            <View style={styles.timeContainer}>
                <View style={styles.svgContainer}>
                    <Svg height="250" width="250" viewBox="0 0 220 220">
                        <Circle
                            cx="110"
                            cy="110"
                            r={radius}
                            stroke={Colors.accent50}
                            strokeWidth={strokeWidth}
                            fill="none"
                            opacity={0.3}
                        />
                        <AnimatedCircle
                            cx="110"
                            cy="110"
                            r={radius}
                            stroke={Colors.accent50}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={circleSize.interpolate({
                                inputRange: [0, 1],
                                outputRange: [circumference, 0], // Se vide progressivement
                            })}
                            strokeLinecap="round"
                        />
                    </Svg>
                </View>
                <Text style={styles.timeLeft}>{formatTime(timeLeft)}</Text>
            </View>
            <FlatButton onPress={onTimerEnd}>Cancel</FlatButton>
        </View>
    );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default Rest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    svgContainer: {
        transform: [{rotate: '-90deg'}]
    },
    timeLeft: {
        position: 'absolute',
        fontSize: 72,
        color: 'white',
        textAlign: 'center',
    }
});