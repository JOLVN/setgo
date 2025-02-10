import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/styles";

interface ToggleViewProps {
    title: string;
    maxHeight: number;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function ToggleView({title, maxHeight, isExpanded, onToggle, children}: ToggleViewProps) {

    const height = useRef(new Animated.Value(0)).current;
    const radius = useRef(new Animated.Value(0)).current;
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(height, {
            toValue: isExpanded ? maxHeight : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(radius, {
            toValue: isExpanded ? 0 : 10,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(rotation, {
            toValue: isExpanded ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isExpanded, maxHeight]);

    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.container}>
            <Pressable onPress={onToggle}>
                <Animated.View style={[styles.titleContainer, {borderBottomLeftRadius: radius, borderBottomRightRadius: radius}]}>
                    <Text style={styles.title}>{title}</Text>
                    <Animated.Image style={[styles.chevron, {transform: [{rotate}]}]} source={require('../../assets/icons/chevron-down.png')} />
                </Animated.View>
            </Pressable>
            <Animated.View style={[styles.contentContainer, {height}]}>
                {children}
            </Animated.View>
        </View>
    )
}

export default ToggleView;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    titleContainer: {
        padding: 20,
        backgroundColor: Colors.gray700,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat-bold',
    },
    chevron: {
        width: 20,
        height: 10,
    },
    contentContainer: {
        backgroundColor: Colors.gray800,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow: 'hidden',
    },
});