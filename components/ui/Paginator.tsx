import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { Colors } from "../../constants/styles";

interface PaginatorProps {
    data: any[];
    scrollX: Animated.Value;
    style?: object;
}

function Paginator({data, scrollX, style}: PaginatorProps) {

    const { width } = useWindowDimensions();

    return (
        <View style={[styles.container, style]}>
            {data.map((_, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.6, 1, 0.6],
                    extrapolate: 'clamp',
                });
                return <Animated.View key={index} style={[styles.dot, {width: dotWidth}, {opacity} ]} />
            })}
        </View>
    )
}

export default Paginator;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: -30,
        left: '50%',
        transform: [{translateX: '-50%'}],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary500,
        marginHorizontal: 8,
    }
});