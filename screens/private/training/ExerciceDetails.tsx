import { Keyboard, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Exercice, FilteredSession, Set } from "../../../types/database";
import { Colors } from "../../../constants/styles";
import { formatDateToString } from "../../../utils/date";
import { createSet, getLastSet, getTodaySets, updateExerciceLastTrainingDate, updateSessionLastTrainingDate } from "../../../utils/db";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { getOrdinalSuffix } from "../../../utils/utils";
import LoadingOverlay from "../../../components/ui/LoadingOverlay";
import Button from "../../../components/ui/buttons/Button";
import {Picker} from '@react-native-picker/picker';
import NumberInput from "../../../components/ui/NumberInput";
import { SessionsContext } from "../../../store/sessions-context";
import IconButton from "../../../components/ui/buttons/IconButton";

interface RouteParams {
    key: string;
    name: string;
    params: {
        exercice: Exercice;
    };
};

interface ExerciceDetailsProps {
    navigation: any;
    route: RouteParams;
}

function ExerciceDetails({navigation, route}: ExerciceDetailsProps) {

    const { exercice } = route.params;
    const sessionsContext = useContext(SessionsContext);
    const [exerciceData, setExerciceData] = useState<Exercice>(exercice);
    const [currentSetNumber, setCurrentSetNumber] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedWeightText, setSelectedWeightText] = useState<string>('30');
    const [selectedReps, setSelectedReps] = useState<number>(10);
    const [selectedRestMinute, setSelectedRestMinute] = useState<number>(1);
    const [selectedRestSecond, setSelectedRestSecond] = useState<number>(30);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerRight: () => (
                <View style={styles.headerIcons}>
                    <IconButton onPress={onViewHistoryHandler} iconName="history" />
                    <IconButton onPress={onEditExerciceGoalHandler} iconName="edit" />
                </View>
            )
        })
    }, [navigation, exercice, exerciceData]);

    function onViewHistoryHandler() {
        navigation.navigate('ExerciceHistory', {exercice: exerciceData});
    }

    function onEditExerciceGoalHandler() {
        navigation.navigate('EditExerciceGoal', {exercice: exerciceData});
    }

    async function getCurrentSetNumber() {
        setIsLoading(true);

        const isFirstSet = 
            !exercice.lastTrainingDate || 
            (exercice.lastTrainingDate && formatDateToString(exercice.lastTrainingDate) !== new Date().toLocaleDateString());
    
        if (isFirstSet) {
            setCurrentSetNumber(1);
            const lastSet = await getLastSet(exercice.id);
            if (lastSet) {
                setLastSetData(lastSet);
            }
            setIsLoading(false);
            return;
        };

        const todaySets = await getTodaySets(exercice.id);
        const lastSet = todaySets[todaySets.length - 1];
        
        setLastSetData(lastSet);
        setCurrentSetNumber(todaySets.length + 1);
        setIsLoading(false);
    }

    function setLastSetData(lastSet: Set) {
        setSelectedWeightText(lastSet.weight.toString());
        setSelectedReps(lastSet.reps);
        setSelectedRestMinute(Math.floor(lastSet.rest / 60));        
        setSelectedRestSecond(lastSet.rest % 60);
    }

    function onChangeWeight(text: string) {
        const formattedText = text
            .replace(/[^0-9,\.]/g, "")
            .replace(/[,\.](?=.*[,\.])/g, "");
        setSelectedWeightText(formattedText);
    }

    async function onSubmitHandler() {
        setIsSubmitting(true);

        const weight = parseFloat(selectedWeightText.replace(',', '.'));
        const rest = (Number(selectedRestMinute) * 60) + Number(selectedRestSecond);
        const reps = selectedReps;

        try {
            await createSet(exercice.id, exercice.title, currentSetNumber, weight, reps, rest);
            await updateExerciceLastTrainingDate(exercice.id);
            await updateSessionLastTrainingDate(exercice.sessionId);
            sessionsContext.updateLastTrainingDate(exercice.sessionId, exercice.categoryId, exercice.id);
            setCurrentSetNumber(currentSetNumber + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
            if (rest > 0) {
                navigation.navigate('Rest', {duration: rest});
            }
        }
    }

    useEffect(() => {
        getCurrentSetNumber();
    }, []);

    useEffect(() => {
        const sessionData = sessionsContext.sessions.find(s => s.id === exercice.sessionId);
        const exerciceCategoryData = (sessionData as FilteredSession | null)?.exerciceCategories.find(c => c.id === exercice.categoryId);
        const exerciceContextData = exerciceCategoryData?.exercices.find(e => e.id === exercice.id);
        if (exerciceContextData) {
            setExerciceData(exerciceContextData);
        }
    }, [sessionsContext.sessions]);

    if (isLoading) {
        return <LoadingOverlay />
    }
    
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{exerciceData.title}</Text>
                        {exerciceData.goal && (
                            <Text style={styles.goal}>{exerciceData.goal}</Text>
                        )}
                        <View style={styles.line}/>
                    </View>
                    <View style={styles.setNumberContainer}>
                        <View style={styles.setNumberInnerContainer}>
                            <Text style={styles.setNumber}>{`${currentSetNumber}${getOrdinalSuffix(currentSetNumber)}`}</Text>
                            <Text style={styles.setText}>set</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.datasContainer}>
                    <View style={styles.rowDatasContainer}>
                        <View style={styles.dataContainer}>
                            <View style={styles.dataInnerContainer}>
                                <Text style={styles.dataTitle}>Weight</Text>
                                <View style={styles.data}>
                                    <NumberInput value={selectedWeightText} onChangeNumber={onChangeWeight} />
                                    <Text style={styles.dataUnit}>Kg</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.dataContainer}>
                            <View style={styles.dataInnerContainer}>
                                <Text style={styles.dataTitle}>Reps</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        style={styles.picker}
                                        itemStyle={styles.pickerItem}
                                        selectionColor={Colors.accent50}
                                        mode="dropdown"
                                        selectedValue={selectedReps}
                                        onValueChange={(itemValue) =>
                                            setSelectedReps(itemValue)
                                        }>
                                        {Array.from({ length: 20 }, (_, i) => (
                                            <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.dataInnerContainer}>
                        <Text style={styles.dataTitle}>Rest</Text>
                        <View style={styles.data}>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                    selectionColor={Colors.accent50}
                                    mode="dropdown"
                                    selectedValue={selectedRestMinute}
                                    onValueChange={(itemValue) => setSelectedRestMinute(itemValue)}>
                                    <Picker.Item label="0" value={0} />
                                    <Picker.Item label="1" value={1} />
                                    <Picker.Item label="2" value={2} />
                                    <Picker.Item label="3" value={3} />
                                    <Picker.Item label="4" value={4} />
                                    <Picker.Item label="5" value={5} />
                                </Picker>
                            </View>
                            <Text style={styles.dataUnit}>min</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                    selectionColor={Colors.accent50}
                                    mode="dropdown"
                                    selectedValue={selectedRestSecond}
                                    onValueChange={(itemValue) => setSelectedRestSecond(itemValue)}>
                                    <Picker.Item label="0" value={0} />
                                    <Picker.Item label="15" value={15} />
                                    <Picker.Item label="30" value={30} />
                                    <Picker.Item label="45" value={45} />
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>
                <Button onPress={onSubmitHandler} isLoading={isSubmitting}>Check</Button>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default ExerciceDetails;

const styles = StyleSheet.create({
    headerIcons: {
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        paddingHorizontal: 50,
        paddingVertical: Platform.OS === 'ios' ? 50 : 20,
        justifyContent: 'space-between',
    },
    titleContainer: {
        gap: 5
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat-bold',
    },
    goal: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Montserrat-medium',
    },
    line: {
        width: 100,
        height: 3,
        backgroundColor: Colors.primary500
    },
    setNumberContainer: {
        marginVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    setNumberInnerContainer: {
        width: Platform.OS === 'ios' ? 150 : 120,
        height: Platform.OS === 'ios' ? 150 : 120,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: Colors.primary500,
        justifyContent: 'center',
        alignItems: 'center',
    },
    setNumber: {
        color: 'white',
        fontSize: Platform.OS === 'ios' ? 50 : 32,
        fontFamily: 'Montserrat-bold',
        marginVertical: -5
    },
    setText: {
        color: 'white',
        fontSize: Platform.OS === 'ios' ? 28 : 20,
        fontFamily: 'Montserrat-semibold',
        marginVertical: -5,
    },
    datasContainer: {
        gap: 20,
        marginBottom: 50,
    },
    rowDatasContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    dataContainer: {
        width: '45%',
    },
    dataInnerContainer: {
        width: '100%',
        height: 110,
        borderRadius: 10,
        backgroundColor: Colors.gray700,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    dataTitle: {
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
        fontFamily: 'Montserrat-medium',
    },
    data: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    pickerContainer: {
        justifyContent: 'center',
        height: 50,
        overflow: 'hidden',
        backgroundColor: Platform.OS === 'ios' ? 'none' : Colors.gray500,
        borderRadius: 10,
    },
    picker: {
        width: 100,
        height: 200,
    },
    pickerItem: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Montserrat-semibold',
        marginVertical: -10,
    },
    dataUnit: {
        color: 'white',
        fontSize: Platform.OS === 'ios' ? 28 : 20,
        fontFamily: 'Montserrat-semibold',
    }
});