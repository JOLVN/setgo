import { Alert, Image, Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../../constants/styles";
import { signInWithGoogle } from "../../utils/auth";

interface GoogleAuthButtonProps {
    isLogin: boolean;
}

function onGoogleAuth() {
    Alert.alert('Google Auth', 'Google Auth is not implemented yet.');
}

function GoogleAuthButton({isLogin}: GoogleAuthButtonProps) {
    
    return (
        <Pressable style={({pressed}) => [styles.buttonContainer, pressed && styles.pressed]} onPress={onGoogleAuth}>
            <Image style={styles.image} source={require('../../assets/images/google-logo.png')} />
            <Text style={styles.text}>{isLogin ? 'Sign in' : 'Sign up'} with Google</Text>
        </Pressable>
    )
}

export default GoogleAuthButton;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.gray400,
        width: '100%',
    },
    image: {
        width: 20,
        height: 20,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Montserrat-medium',
    },
    pressed: {
        opacity: 0.9,
    }
});
