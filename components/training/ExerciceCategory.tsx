import { Pressable, StyleSheet, Text, View } from "react-native";
import { FilteredExerciceCategory } from "../../types/database";
import { Colors } from "../../constants/styles";
import { getDayInterval } from "../../utils/date";
import { useNavigation } from "@react-navigation/native";
import ToggleView from "../ui/ToggleView";

interface ExerciceCategoryProps {
    exerciceCategory: FilteredExerciceCategory;
    isExpanded: boolean;
    onToggle: () => void;
}

function ExerciceCategory({exerciceCategory, isExpanded, onToggle}: ExerciceCategoryProps) {

    const navigation = useNavigation<any>();

    const maxHeight = exerciceCategory.exercices.length * 58;


    function onPressExerciceHandler(exerciceId: string)  {
        const exercice = exerciceCategory.exercices.find(exercice => exercice.id === exerciceId);
        navigation.navigate('ExerciceDetails', {exercice});
    }

    return (
        <View>
            <ToggleView 
                title={`${exerciceCategory.index + 1}. ${exerciceCategory.title}`}
                maxHeight={maxHeight}
                isExpanded={isExpanded}
                onToggle={onToggle}
            >
                {exerciceCategory.exercices.map((exercice, index) => {
                    const numberOfDays = exercice.lastTrainingDate ? getDayInterval(exercice.lastTrainingDate) : null;
                    return (
                        <Pressable 
                            key={exercice.id} 
                            onPress={() => onPressExerciceHandler(exercice.id)}
                            style={[
                                styles.exerciceContainer, 
                                (index + 1) !== exerciceCategory.exercices.length && styles.borderBottom
                            ]}
                        >
                            <Text style={styles.exerciceTitle}>{exercice.title}</Text>
                            {numberOfDays !== null && (
                                <Text style={[
                                    styles.day, 
                                    numberOfDays > 7 && styles.orangeDay, 
                                    numberOfDays > 14 && styles.redDay
                                ]}>{numberOfDays}</Text>
                            )}
                        </Pressable>
                    )
                })}
            </ToggleView>
        </View>
    )
}

export default ExerciceCategory;

const styles = StyleSheet.create({
    exerciceContainer: {
        marginHorizontal: 20,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
    },
    exerciceTitle: {
        color: Colors.accent50,
        fontSize: 16,
        fontFamily: 'Montserrat-medium',
    },
    day: {
        fontFamily: 'Montserrat-bold',
        color: Colors.success500,
    },
    orangeDay: {
        color: Colors.warning500,
    },
    redDay: {
        color: Colors.error500,
    }
});