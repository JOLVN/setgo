import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import Button from "../../components/ui/buttons/Button";
import PrimaryTitle from "../../components/texts/PrimaryTitle";
import FlatButton from "../../components/ui/buttons/FlatButton";
import Input from "../../components/ui/Input";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { createSession } from "../../utils/db";
import { SessionsContext } from "../../store/sessions-context";

function AddSession() {

    const sessionsContext = useContext(SessionsContext);
    const [sessionName, setSessionName] = useState('');
    const [sessionNameInvalid, setSessionNameInvalid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigation = useNavigation();

    function dismissKeyboard() {
        Keyboard.dismiss();
    }

    async function onSubmitHandler() {
        if (sessionName.trim().length < 1) {
            setSessionNameInvalid(true);
            Alert.alert("Invalid Name", "Please enter a valid name for the session.");
            return;
        }
        try {
            setIsSubmitting(true);
            const id = await createSession(sessionName);
            if (id) sessionsContext.addSession(id, sessionName);
            setIsSubmitting(false);
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <PrimaryTitle>New Session</PrimaryTitle>
                <Input label={"Name"} onChange={setSessionName} isInvalid={sessionNameInvalid} />
                <View style={styles.buttons}>
                    <Button onPress={onSubmitHandler} isLoading={isSubmitting}>Create session</Button>
                    <FlatButton onPress={() => navigation.goBack()} red={true}>Cancel</FlatButton>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default AddSession;

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
