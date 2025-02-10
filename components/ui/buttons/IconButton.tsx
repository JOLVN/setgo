import { Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

interface FlatButtonProps {
    iconName: string;
    onPress: () => void;
}

function IconButton({iconName, onPress}: FlatButtonProps) {
    return (
        <Pressable style={({pressed}) => [styles.button, pressed && styles.pressed]} onPress={onPress}>
            <MaterialIcons name={iconName as any} size={22} color="white" />
        </Pressable>
    )
}

export default IconButton;

const styles = StyleSheet.create({
    button: {
        padding: 12,
        alignItems: 'center',
    },
    pressed: {
        opacity: 0.8,
    }
});