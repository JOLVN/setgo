import { useNavigation } from "@react-navigation/native";
import { Alert, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Colors } from "../../constants/styles";
import GoogleAuthButton from "./GoogleAuthButton";
import Separator from "./Separator";
import AuthForm from "./AuthForm";
import { Credentials } from "../../types/credentials";
import AppLogo from "../AppLogo";
import { useState } from "react";


interface AuthContentProps {
    isLogin: boolean;
    onAuthenticate: (credientials: Credentials) => void;
    isSubmiting: boolean;
}
    

function AuthContent({isLogin, onAuthenticate, isSubmiting}: AuthContentProps) {

    const navigation = useNavigation<any>();

    const [credentialsInvalid, setCredentialsInvalid] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    function switchAuthModeHandler() {
        if (isLogin) {
            navigation.replace('Signup');
        } else {
            navigation.replace('Login');
        }
    }

    function dismissKeyboard() {
        Keyboard.dismiss();
    }

    function areCredentialsValid(credentials: Credentials) {
        let { name, email, password, confirmPassword } = credentials;

        let nameIsValid = true;
        if (name !== undefined)
            nameIsValid = name.trim().length > 1 && name.trim().length < 20;
        const emailIsValid = email.includes('@');
        const passwordIsValid = password.length > 6;
        const confirmPasswordIsValid = confirmPassword === password;

        if (isLogin) {
            if (!emailIsValid || !passwordIsValid) {
                Alert.alert('Invalid input', 'Please check your entered credentials.');
                setCredentialsInvalid({
                    name: false,
                    email: !emailIsValid,
                    password: !passwordIsValid,
                    confirmPassword: false,
                });
                return false;
            }
        } else if (!nameIsValid || !emailIsValid || !passwordIsValid || !confirmPasswordIsValid) {
            Alert.alert('Invalid input', 'Please check your entered credentials.');
            setCredentialsInvalid({
                name: !nameIsValid,
                email: !emailIsValid,
                password: !passwordIsValid,
                confirmPassword: !confirmPasswordIsValid,
            });
            return false;
        }
        return true;
    }

    function submitHandler(credentials: Credentials) {

        let { name, email, password, confirmPassword } = credentials;
        email = email.trim();

        if (!areCredentialsValid(credentials)) {
            return;
        }
        
        setCredentialsInvalid({
            name: false,
            email: false,
            password: false,
            confirmPassword: false,
        });
        
        onAuthenticate({name, email, password});
    }

    function BottomSection() {
        return (
            <View style={[styles.flexContainer, styles.bottomContainer]}>
                <Text style={styles.bottomText}>
                    {isLogin ? "Not a member ? " : "Already have an account ? "}
                </Text>
                <Pressable style={({pressed}) => pressed && styles.pressed} onPress={switchAuthModeHandler}>
                    <Text style={styles.bottomButton}>{isLogin ? "Create your account" : "Log in"}</Text>
                </Pressable>
            </View>
        )
    }

    
    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.rootContainer}>
                    <View style={styles.flexContainer} />
                    <KeyboardAvoidingView style={styles.authContainer} behavior="position">
                        <View style={styles.authInnerContainer}>
                            <AppLogo />
                            <Text style={styles.title}>{isLogin ? 'Sign in to your account' : 'Create an account'}</Text>
                            <GoogleAuthButton isLogin={isLogin} />
                            <Separator />
                            <AuthForm isLogin={isLogin} onSubmit={submitHandler} credentialsInvalid={credentialsInvalid} isSubmiting={isSubmiting} />
                        </View>
                    </KeyboardAvoidingView>
                    <BottomSection />
            </View>
        </TouchableWithoutFeedback>
    )
}

export default AuthContent;

const styles = StyleSheet.create({
    /////
    // GLOBAL
    /////
    rootContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
    authContainer: {
        height: '70%',
        width: '80%',
    },
    authInnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background500,
        height: '100%',
        width: '100%',
        padding: 32,
        borderRadius: 30,
        gap: 24
    },
    flexContainer: {
        height: '15%'
    },
    // BOTTOM SECTION
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Montserrat-medium',
    },
    bottomButton: {
        color: Colors.primary500,
        fontSize: 16,
        fontFamily: 'Montserrat-bold',
    },
    pressed: {
        opacity: 0.5,
    },
    /////
    // AUTH CONTAINER
    /////
    title: {
        fontSize: 20,
        fontFamily: 'Montserrat-bold',
        color: Colors.primary500,
    },
});