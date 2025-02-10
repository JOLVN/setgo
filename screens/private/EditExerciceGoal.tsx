import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Button from "../../components/ui/buttons/Button";
import PrimaryTitle from "../../components/texts/PrimaryTitle";
import FlatButton from "../../components/ui/buttons/FlatButton";
import Input from "../../components/ui/Input";
import { useContext, useState } from "react";
import { auth } from "../../config/firebase";
import { SessionsContext } from "../../store/sessions-context";
import { Exercice } from "../../types/database";
import { updateExerciceGoal } from "../../utils/db";

interface RouteParams {
    key: string;
    name: string;
    params: {
        exercice: Exercice;
    };
};

interface EditExerciceGoalProps {
    navigation: any;
    route: RouteParams;
}

function EditExerciceGoal({ navigation, route }: EditExerciceGoalProps) {

    const { exercice } = route.params;
    const sessionsContext = useContext(SessionsContext);
    const [exerciceGoal, setExerciceGoal] = useState<string>(exercice.goal || '');
    const [exerciceGoalInvalid, setExerciceGoalInvalid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function dismissKeyboard() {
        Keyboard.dismiss();
    }

    function onExerciceGoalChange(text: string) {
        setExerciceGoal(text);
        setExerciceGoalInvalid(false);
    }

    async function onSubmitHandler() {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Not Logged In", "You need to be logged in to create a session.");
            return;
        }
        if (exerciceGoal.trim().length < 1) {
            setExerciceGoalInvalid(true);
            Alert.alert("Invalid Goal", "Please enter a valid goal for the exercice.");
            return;
        }
        try {
            setIsSubmitting(true);
            await updateExerciceGoal(exercice.id, exerciceGoal);
            sessionsContext.updateExerciceGoal(exercice.sessionId, exercice.categoryId, exercice.id, exerciceGoal);
            setIsSubmitting(false);
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <PrimaryTitle>Exercice goal</PrimaryTitle>
                <Input label={"Goal"} value={exerciceGoal} onChange={onExerciceGoalChange} isInvalid={exerciceGoalInvalid} />
                <View style={styles.buttons}>
                    <Button onPress={onSubmitHandler} isLoading={isSubmitting}>Save goal</Button>
                    <FlatButton onPress={() => navigation.goBack()} red={true}>Cancel</FlatButton>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default EditExerciceGoal;

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
