import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { FilteredExerciceCategory, FilteredSession } from "../../types/database";
import { Colors } from "../../constants/styles";
import SecondaryTitle from "../texts/SecondaryTitle";
import Input from "../ui/Input";
import AddExerciceCategory from "../ui/AddExerciceCategory";
import AddExercice from "../ui/AddExercice";
import { Entypo } from '@expo/vector-icons';

interface ExerciceCategoryEditingProps {
    exerciceCategoryIndex: number;
    sessionData: FilteredSession;
    setSessionData: (sessionData: FilteredSession) => void;
}

function ExerciceCategoryEditing({exerciceCategoryIndex, sessionData, setSessionData}: ExerciceCategoryEditingProps) {

    const { width, height } = useWindowDimensions();

    const exerciceCategory = sessionData.exerciceCategories[exerciceCategoryIndex];

    function updateExerciceCategories(updatedExerciceCategories: FilteredExerciceCategory[]) {
        setSessionData({
            ...sessionData,
            exerciceCategories: updatedExerciceCategories
        });
    }
    
    function changeExerciceCategoryName(categoryName: string) {
        const updatedExerciceCategories = sessionData.exerciceCategories.map((category, index) => {
            if (index === exerciceCategoryIndex) {
                return {
                    ...category,
                    title: categoryName
                }
            }
            return category;
        });
        updateExerciceCategories(updatedExerciceCategories as FilteredExerciceCategory[]);
    }

    function changeExerciceName(exerciceIndex: number, exerciceName: string) {
        const updatedExerciceCategories = sessionData.exerciceCategories.map((category, index) => {
            if (index === exerciceCategoryIndex) {
                return {
                    ...category,
                    exercices: category.exercices.map((exercice, index) => {
                        if (index === exerciceIndex) {
                            return {
                                ...exercice,
                                title: exerciceName
                            }
                        }
                        return exercice;
                    })
                }
            }
            return category;
        });
        updateExerciceCategories(updatedExerciceCategories as FilteredExerciceCategory[]);
    }

    function addEmptyExercice() {
        const updatedExerciceCategories = sessionData.exerciceCategories.map((category, index) => {
            if (index === exerciceCategoryIndex) {
                return {
                    ...category,
                    exercices: [
                        ...category.exercices,
                        {
                            id: Date.now().toString(),
                            title: '',
                            index: category.exercices.length,
                            lastTrainingDate: null,
                            categoryId: category.id,
                            sessionId: category.sessionId,
                            userId: category.userId
                        }
                    ]
                }
            }
            return category;
        });
        updateExerciceCategories(updatedExerciceCategories as FilteredExerciceCategory[]);
    }

    function addExerciceCategory() {
        let updatedExerciceCategories = sessionData.exerciceCategories.map((category, index) => {
            if (index === exerciceCategoryIndex) {
                return {
                    ...category,
                    exercices: [
                        ...category.exercices,
                        {
                            id: Date.now().toString(),
                            title: '',
                            index: category.exercices.length,
                            lastTrainingDate: null,
                            categoryId: category.id,
                            sessionId: category.sessionId,
                            userId: category.userId
                        }
                    ]
                }
            }
            return category;
        });
        if (updatedExerciceCategories.length < 10) {
            updatedExerciceCategories = [
                ...updatedExerciceCategories,
                {
                    id: Date.now().toString(),
                    title: '',
                    index: sessionData.exerciceCategories.length,
                    sessionId: sessionData.id,
                    userId: sessionData.userId,
                    exercices: []
                }
            ];
        }
        updateExerciceCategories(updatedExerciceCategories as FilteredExerciceCategory[]);
    }

    function deleteExerciceCategory() {
        const updatedExerciceCategories = sessionData.exerciceCategories
            .filter((_, index) => index !== exerciceCategoryIndex)
            .map((category, newIndex) => ({
                ...category,
                index: newIndex,
            }));

        updateExerciceCategories(updatedExerciceCategories as FilteredExerciceCategory[]);
    }

    function deleteExercice(index: number) {
        const updatedExerciceCategories = sessionData.exerciceCategories.map((category, categoryIndex) => {
            if (categoryIndex === exerciceCategoryIndex) {
                const updatedExercices = category.exercices
                    .filter((_, exerciceIndex) => exerciceIndex !== index)
                    .map((exercice, newIndex) => ({
                        ...exercice,
                        index: newIndex,
                    }));

                return {
                    ...category,
                    exercices: updatedExercices,
                };
            }
            return category;
        });
        updateExerciceCategories(updatedExerciceCategories as FilteredExerciceCategory[]);
    }

    if (!exerciceCategory) {
        return null;
    }

    return (
        <View style={{width}}>
            {exerciceCategory.exercices.length === 0 && (
                <View style={{height: height / 2.2}}>
                    <AddExerciceCategory onPress={addExerciceCategory} />
                </View>
            )}
            {exerciceCategory.exercices.length > 0 && (
                <View style={[styles.innerContainer, {maxHeight: height / 2.2}]}>
                    {exerciceCategory.index > 0 && (
                        <Pressable style={styles.deleteCategoryButton} onPress={deleteExerciceCategory}>
                            <Entypo name="cross" size={20} color={'white'} />
                        </Pressable>
                    )}
                    <SecondaryTitle>Category {exerciceCategory.index + 1}</SecondaryTitle>
                    <ScrollView style={styles.inputs}>
                        <View style={styles.input}>
                            <Input label="Name" value={exerciceCategory.title} onChange={changeExerciceCategoryName} />
                        </View>
                        {exerciceCategory.exercices.map((exercice, index) => {
                            return (
                                <View style={styles.inputContainer} key={exercice.id}>
                                    <View style={[styles.input, exercice.index > 0 && {width: '85%'}]} key={exercice.id}>
                                        <Input label={`Exercice ${exercice.index + 1}`} value={exercice.title} onChange={(text: string) => changeExerciceName(index, text)} />
                                    </View>
                                    {exercice.index > 0 && (
                                        <Pressable style={styles.deleteExerciceButton} onPress={() => deleteExercice(exercice.index)}>
                                            <Entypo name="minus" size={15} color={'white'} />
                                        </Pressable>
                                    )}
                                </View>
                            )
                        })}
                        <AddExercice onPress={addEmptyExercice} />
                    </ScrollView>
                </View>
            )}
        </View>
    )
}

export default ExerciceCategoryEditing;

const styles = StyleSheet.create({
    innerContainer: {
        margin: 24,
        paddingHorizontal: 30,
        paddingVertical: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: Colors.background500,
    },
    deleteCategoryButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: Colors.error500,
    },
    deleteExerciceButton: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12.5,
        backgroundColor: Colors.error500,
        marginTop: 20,
    },
    inputs: {
        width: '100%',
        marginTop: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
    },
    input: {
        marginVertical: 5,
        width: '100%',
    }
})