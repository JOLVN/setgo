import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../../../constants/styles";

interface FlatButtonProps {
    children: string;
    onPress: () => void;
    disabled?: boolean;
    red?: boolean;
}

function FlatButton({children, onPress, disabled, red}: FlatButtonProps) {
    return (
        <Pressable style={({pressed}) => [styles.button, pressed && styles.pressed]} onPress={onPress}>
            <Text style={[styles.text, red && styles.red, disabled && styles.disabled]}>{children}</Text>
        </Pressable>
    )
}

export default FlatButton;

const styles = StyleSheet.create({
    button: {
        padding: 12,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: Platform.OS === 'ios' ? 18 : 16,
        fontFamily: 'Montserrat-medium',
    },
    red: {
        color: Colors.error500,
    },
    disabled: {
        color: Colors.gray500
    },
    pressed: {
        opacity: 0.8,
    }
});