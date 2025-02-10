import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/styles";
import { Entypo } from '@expo/vector-icons';

interface AddExerciceProps {
    onPress: () => void;
}

function AddExercice({onPress}: AddExerciceProps) {
    return (
        <View style={styles.container}>
            <Pressable style={styles.innerContainer} onPress={onPress}>
                <Entypo name="plus" size={24} color={Colors.accent50} />
            </Pressable>
        </View>
    )
}

export default AddExercice;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    innerContainer: {
        height: 40,
        width: 40,
        borderWidth: 1,
        borderColor: Colors.accent50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
