import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/styles";
import { Entypo } from '@expo/vector-icons';

interface AddExerciceCategoryProps {
    onPress: () => void;
}

function AddExerciceCategory({onPress}: AddExerciceCategoryProps) {
    return (
        <View style={styles.container}>
            <Pressable style={styles.innerContainer} onPress={onPress}>
                <Entypo name="plus" size={50} color={Colors.accent50} />
            </Pressable>
        </View>
    )
}

export default AddExerciceCategory;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    innerContainer: {
        height: 110,
        width: 110,
        borderWidth: 1,
        borderColor: Colors.accent50,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
