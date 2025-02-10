import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/buttons/Button";
import FlatButton from "../../../components/ui/buttons/FlatButton";
import { useState } from "react";
import { updateUserName } from "../../../utils/auth";
import { auth } from "../../../config/firebase";

interface EditUserNameProps {
    navigation: any;
}

function EditUserName({navigation}: EditUserNameProps) {

    const [userName, setUserName] = useState(auth.currentUser?.displayName || '');
    const [userNameInvalid, setUserNameInvalid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function dismissKeyboard() {
        Keyboard.dismiss();
    }

    async function onSubmitHandler() {
        if (userName.trim().length < 2) {
            setUserNameInvalid(true);
            Alert.alert("Invalid Name", "Please enter a valid name for the session.");
            return;
        }
        try {
            setIsSubmitting(true);
            await updateUserName(userName);
            setIsSubmitting(false);
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Input label={"Name"} onChange={setUserName} isInvalid={userNameInvalid} value={userName} />
                <View style={styles.buttons}>
                    <Button onPress={onSubmitHandler} isLoading={isSubmitting}>Save</Button>
                    <FlatButton onPress={() => navigation.goBack()} red={true}>Cancel</FlatButton>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default EditUserName;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 50,
        gap: 50,
    },
    buttons: {
        width: '100%',
    }
});
