import { StyleSheet, TextInput } from "react-native";
import { Colors } from "../../constants/styles";
import { useState } from "react";

interface AuthInputProps {
    position: 'top' | 'middle' | 'bottom';
    onChange: (text: string) => void;
    isInvalid?: boolean;
    placeholder?: string;
    isPassword?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

function AuthInput({position, onChange, isInvalid, placeholder, isPassword, autoCapitalize}: AuthInputProps) {

    const [isInvalidState, setIsInvalidState] = useState(isInvalid);

    function onChangeHandler(text: string) {
        setIsInvalidState(false);
        onChange(text);
    }

    return (
        <TextInput 
            style={[
                styles.input, 
                isInvalidState && styles.inputInvalid,
                position === 'top' && styles.borderTop,
                position === 'bottom' && styles.borderBottom,
                position === 'middle' && styles.middle,
            ]} 
            placeholder={placeholder} 
            onChangeText={onChangeHandler} 
            placeholderTextColor={isInvalidState ? Colors.error600 : Colors.gray600} 
            secureTextEntry={isPassword} 
            autoCapitalize={autoCapitalize}
            textContentType={isPassword ? 'oneTimeCode' : 'none'}
        />
    )

}

export default AuthInput;

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.background800,
        padding: 16,
        width: '100%',
        color: Colors.gray400,
        fontFamily: 'Montserrat-medium',
        borderColor: Colors.gray400,
        borderWidth: 1,
        borderBottomWidth: 0,
    },
    inputInvalid: {
        color: Colors.error500,
    },
    borderTop: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    middle: {
        borderRadius: 0,
        borderBottomWidth: 0,
    }
});