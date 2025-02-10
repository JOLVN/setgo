import { FlatList, View } from "react-native";
import { FilteredExerciceCategory } from "../../types/database";
import ExerciceCategory from "./ExerciceCategory";
import { useState } from "react";

interface ExerciceCategoriesProps {
    exerciceCategories: FilteredExerciceCategory[];
}

function ExerciceCategories({exerciceCategories}: ExerciceCategoriesProps) {

    const [expandedCategoryIndex, setExpandedCategoryIndex] = useState<number | null>(null);
    const filteredExerciceCategory = exerciceCategories.filter(category => category.exercices.length > 0);

    const handleToggle = (index: number) => {
        setExpandedCategoryIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <View style={styles.container}>
            <FlatList data={filteredExerciceCategory} keyExtractor={item => item.id} renderItem={({item, index}) => {
                return (
                    <ExerciceCategory 
                        exerciceCategory={item} 
                        isExpanded={expandedCategoryIndex === index} 
                        onToggle={() => handleToggle(index)} 
                    />
                )
            }}/>
        </View>
    )
}

export default ExerciceCategories;

const styles = {
    container: {
        flex: 1,
        paddingHorizontal: 30,
    }
}