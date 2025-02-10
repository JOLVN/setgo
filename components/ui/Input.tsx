import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/styles";

interface AuthInputProps {
    label: string;
    onChange: (text: string) => void;
    isInvalid?: boolean;
    placeholder?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    value?: string;
    style?: object;
    onFocus?: () => void;
    onBlur?: () => void;
    isPassword?: boolean;
}

function Input({label, onChange, isInvalid, placeholder, autoCapitalize, value, style, onFocus, onBlur, isPassword}: AuthInputProps) {

    // const [isInvalidState, setIsInvalidState] = useState(isInvalid);

    function onChangeHandler(text: string) {
        // setIsInvalidState(false);
        onChange(text);
    }

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.label}>{label}</Text>
            <TextInput 
                style={[
                    styles.input, 
                    isInvalid && styles.inputInvalid,
                ]} 
                value={value}
                placeholder={placeholder} 
                onChangeText={onChangeHandler} 
                placeholderTextColor={isInvalid ? Colors.error600 : Colors.primary700} 
                autoCapitalize={autoCapitalize}
                onFocus={onFocus}
                onBlur={onBlur}
                secureTextEntry={isPassword}
            />
        </View>
    )

}

export default Input;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        color: Colors.primary500,
        fontSize: 16,
        marginBottom: 8,
        fontFamily: 'Montserrat-medium',
    },
    input: {
        backgroundColor: Colors.background800,
        padding: 16,
        width: '100%',
        color: Colors.primary500,
        fontFamily: 'Montserrat-medium',
        borderColor: Colors.primary500,
        borderWidth: 1,
        borderRadius: 8,
    },
    inputInvalid: {
        color: Colors.error500,
        borderColor: Colors.error500
    },
});