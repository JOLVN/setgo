import { ActivityIndicator, Platform, Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../../../constants/styles";

interface ButtonProps {
    children: string;
    onPress: () => void;
    isLoading?: boolean;
}

function Button({children, onPress, isLoading}: ButtonProps) {
    return (
        <Pressable style={({pressed}) => [styles.button, pressed && styles.pressed]} onPress={onPress}>
            {isLoading && (
                <ActivityIndicator size="small" color={Colors.background800} />
            )}
            {!isLoading && (
                <Text style={styles.text}>{children}</Text>
            )}
        </Pressable>
    )
}

export default Button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.accent50,
        padding: Platform.OS === 'ios' ? 14 : 10,
        width: '100%',
        borderRadius: 8,
        alignItems: 'center',
    },
    text: {
        color: Colors.background800,
        fontSize: Platform.OS === 'ios' ? 20 : 16,
        fontFamily: 'Montserrat-medium',
    },
    pressed: {
        opacity: 0.9,
    }
});