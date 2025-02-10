import { Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../../../constants/styles";

interface OutlinedButtonProps {
    children: string;
    onPress: () => void;
    style?: any;
}

function OutlinedButton({children, onPress, style}: OutlinedButtonProps) {
    return (
        <Pressable style={({pressed}) => [styles.button, style, pressed && styles.pressed]} onPress={onPress}>
            <Text style={styles.text}>{children}</Text>
        </Pressable>
    )
}

export default OutlinedButton;

const styles = StyleSheet.create({
    button: {
        borderColor: Colors.accent50,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        minWidth: 150,
    },
    text: {
        color: Colors.accent50,
        fontSize: 20,
        fontFamily: 'Montserrat-medium',
    },
    pressed: {
        opacity: 0.9,
    }
});