import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/buttons/Button";
import FlatButton from "../../../components/ui/buttons/FlatButton";
import { useState } from "react";
import { updateUserPassword } from "../../../utils/auth";

interface EditUserNameProps {
    navigation: any;
}

function EditUserPassword({navigation}: EditUserNameProps) {

    const [userCurrentPassword, setUserCurrentPassword] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userConfirmPassword, setUserConfirmPassword] = useState('');
    const [userCurrentPasswordInvalid, setUserCurrentPasswordInvalid] = useState(false);
    const [userPasswordInvalid, setUserPasswordInvalid] = useState(false);
    const [userConfirmPasswordInvalid, setUserConfirmPasswordInvalid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function dismissKeyboard() {
        Keyboard.dismiss();
    }

    async function onSubmitHandler() {
        const currentPasswordIsValid = userCurrentPassword.length > 6;
        const passwordIsValid = userPassword.length > 6;
        const confirmPasswordIsValid = userConfirmPassword === userPassword;

        if (!passwordIsValid || !currentPasswordIsValid) {
            setUserPasswordInvalid(true);
            Alert.alert("Invalid Password", "Password must be at least 6 characters long.");
            return;
        }
        if (!confirmPasswordIsValid) {
            setUserConfirmPasswordInvalid(true);
            Alert.alert("Invalid Password", "Passwords do not match.");
            return;
        }
        try {
            setIsSubmitting(true);
            await updateUserPassword(userCurrentPassword, userPassword);
            setIsSubmitting(false);
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.inputs}>
                    <Input label={"Current Password"} onChange={setUserCurrentPassword} isInvalid={userCurrentPasswordInvalid} isPassword={true} />
                    <Input label={"New Password"} onChange={setUserPassword} isInvalid={userPasswordInvalid} isPassword={true} />
                    <Input label={"Confirm Password"} onChange={setUserConfirmPassword} isInvalid={userConfirmPasswordInvalid} isPassword={true} />
                </View>
                <View style={styles.buttons}>
                    <Button onPress={onSubmitHandler} isLoading={isSubmitting}>Save</Button>
                    <FlatButton onPress={() => navigation.goBack()} red={true}>Cancel</FlatButton>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default EditUserPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 50,
        gap: 50,
    },
    inputs: {
        width: '100%',
        gap: 20,
    },
    buttons: {
        width: '100%',
    }
});
