import { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Colors } from "../constants/styles";

interface ContainerProps {
    children: ReactNode;
    style?: object;
}

function Container({children, style}: ContainerProps) {
    return (
        <View style={styles.outerContainer}>
            <View style={[styles.innerContainer, style]}>
                {children}
            </View>
        </View>
    )
}

export default Container;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: Colors.background600,
    },
    innerContainer: {
        flex: 1,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
        backgroundColor: Colors.background800,
        marginBottom: Platform.OS === 'ios' ? 12 : 0,
    }
});