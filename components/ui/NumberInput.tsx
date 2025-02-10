import { StyleSheet, TextInput, View } from "react-native";
import { Colors } from "../../constants/styles";

interface NumberInputProps {
    value: string;
    onChangeNumber: (text: string) => void;
}

function NumberInput({value, onChangeNumber}: NumberInputProps) {
    return (
        <View>
            <TextInput style={styles.input} keyboardType="numeric" value={value} onChangeText={onChangeNumber}  />
        </View>
    )
}

export default NumberInput;

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.gray500,
        padding: 10,
        borderRadius: 10,
        width: 60,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    }
});