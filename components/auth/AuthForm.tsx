import { StyleSheet, View } from "react-native";
import Button from "../ui/buttons/Button";
import AuthInput from "../ui/AuthInput";
import { useState } from "react";
import { Credentials, CredentialsInvalid } from "../../types/credentials";

interface AuthFormProps {
    onSubmit: (credentials: Credentials) => void;
    isLogin: boolean;
    credentialsInvalid: CredentialsInvalid;
    isSubmiting: boolean;
}

function AuthForm({onSubmit, isLogin, credentialsInvalid, isSubmiting}: AuthFormProps) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {
        name: nameIsInvalid,
        email: emailIsInvalid,
        password: passwordIsInvalid,
        confirmPassword: passwordsDontMatch,
    } = credentialsInvalid;

    function submitHandler() {
        if (isLogin) {
            onSubmit({email, password});
        } else {
            onSubmit({name, email, password, confirmPassword});
        }
    }

    return (
        <View style={styles.rootContainer}>
            <View style={styles.inputsContainer}>
                {isLogin && (
                    <>
                        <AuthInput position="top" isInvalid={emailIsInvalid} placeholder="Email address" onChange={(text: string) => setEmail(text)} autoCapitalize="none" />
                        <AuthInput position="bottom" isInvalid={passwordIsInvalid} placeholder="Password" onChange={(text: string) => setPassword(text)} isPassword={true} />
                    </>
                )}
                {!isLogin && (
                    <>
                        <AuthInput position="top" isInvalid={nameIsInvalid} placeholder="Name" onChange={(text: string) => setName(text)} autoCapitalize="words" />
                        <AuthInput position="middle" isInvalid={emailIsInvalid} placeholder="Email address" onChange={(text: string) => setEmail(text)} autoCapitalize="none" />
                        <AuthInput position="middle" isInvalid={passwordIsInvalid} placeholder="Password" onChange={(text: string) => setPassword(text)} isPassword={true} />
                        <AuthInput position="bottom" isInvalid={passwordsDontMatch} placeholder="Password confirmation" onChange={(text: string) => setConfirmPassword(text)} isPassword={true} />
                    </>
                )}
            </View>
            <Button onPress={submitHandler} isLoading={isSubmiting}>{isLogin ? 'Sign in' : 'Sign up'}</Button>
        </View>
    )
}

export default AuthForm;

const styles = StyleSheet.create({
    rootContainer: {
        width: '100%',
        alignItems: 'center',
    },
    inputsContainer: {
        width: '100%',
        marginBottom: 24
    }
});