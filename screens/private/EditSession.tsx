import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import PrimaryTitle from "../../components/texts/PrimaryTitle";
import { useRoute } from "@react-navigation/native";
import { FilteredSession } from "../../types/database";
import Input from "../../components/ui/Input";
import { useContext, useState } from "react";
import Button from "../../components/ui/buttons/Button";
import FlatButton from "../../components/ui/buttons/FlatButton";
import ExerciceCategoriesEditing from "../../components/training/ExerciceCategoriesEditing";
import { deleteSession, updateSessionData } from "../../utils/db";
import { SessionsContext } from "../../store/sessions-context";

interface RouteParams {
    key: string;
    name: string;
    params: {
        session: FilteredSession;
    };
};

interface EditSessionProps {
    navigation: any;
}

function EditSession({navigation}: EditSessionProps) {

    const sessionsContext = useContext(SessionsContext);
    const route = useRoute<RouteParams>();
    const { session } = route.params;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [sessionNameInvalid, setSessionNameInvalid] = useState(false);
    

    // Add a new empty category
    const filteredSession = {
        ...session,
        exerciceCategories: [
            ...session.exerciceCategories,
            {
                id: Date.now().toString(),
                title: '',
                index: session.exerciceCategories.length,
                sessionId: session.id,
                userId: session.userId,
                exercices: []
            }
        ]
    }

    const [sessionData, setSessionData] = useState<FilteredSession>(filteredSession);

    function changeSessionName(name: string) {
        setSessionNameInvalid(false);
        setSessionData({
            ...sessionData,
            title: name
        });
    }

    function submitValidation() {
        if (sessionData.title.trim().length < 1) {
            Alert.alert("Invalid Name", "Please enter a valid name for the session.");
            setIsSubmitting(false);
            setSessionNameInvalid(true);
            return false;
        }
        for (const category of sessionData.exerciceCategories) {
            if (category.exercices.length > 0 && category.title.trim().length < 1) {
                Alert.alert("Invalid Category Name", "Please enter a valid name for the category.");
                setIsSubmitting(false);
                return false;
            }
            for (const exercice of category.exercices) {
                if (exercice.title.trim().length < 1) {
                    Alert.alert("Invalid Exercice Name", "Please enter a valid name for the exercice.");
                    setIsSubmitting(false);
                    return false;
                }
            }
        }
        return true;
    }

    async function onSubmitHandler() {
        setIsSubmitting(true);
        if (!submitValidation()) return;
        try {
            const newSessionData = await updateSessionData(sessionData);
            sessionsContext.updateSession(newSessionData);
            navigation.goBack();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onDeleteHandler() {
        Alert.alert(
            "Delete session",
            "Are you sure you want to delete this session ?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", style: "destructive", onPress: async () => {
                    setIsDeleting(true);
                    await deleteSession(session.id);
                    sessionsContext.deleteSession(session.id);
                    setIsDeleting(false);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainPages', params: { screen: 'Training', params: { screen: 'Sessions' } } }],
                    });
                }}
            ]
        );
    }


    return (
        <>
            {isDeleting ? (
                <View style={styles.deletingContainer}>
                    <Text style={styles.deletingText}>Deleting the session...</Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View>
                            <PrimaryTitle style={[styles.padding, {marginBottom: 20}]}>Editing "{session.title}"</PrimaryTitle>
                            <Input style={styles.padding} label="Name" value={sessionData.title} onChange={changeSessionName} isInvalid={sessionNameInvalid} />
                        </View>
                    </TouchableWithoutFeedback>
                    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} style={{ flex: 1 }}>
                        <ExerciceCategoriesEditing sessionData={sessionData} setSessionData={setSessionData} onViewableItemsChanged={() => Keyboard.dismiss()} />
                    </KeyboardAvoidingView>
                    <View style={[styles.buttons, styles.padding]}>
                        <Button onPress={onSubmitHandler} isLoading={isSubmitting}>Save</Button>
                        <FlatButton onPress={onDeleteHandler} red={true}>Delete session</FlatButton>
                    </View>
                </View>
            )}
        </>
    )
}

export default EditSession;

const styles = StyleSheet.create({
    deletingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deletingText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Montserrat-medium',
    },
    container: {
        flex: 1,
        marginVertical: 50,
        gap: 20,
    },
    padding: {
        paddingHorizontal: 50,
    },
    buttons: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    }
})