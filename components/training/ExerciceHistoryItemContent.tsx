import { StyleSheet, Text, View } from "react-native";
import { Set } from "../../types/database";
import { Colors } from "../../constants/styles";

interface ExerciceHistoryItemContentProps {
    index: number;
    set: Set;
    length: number;
}

function ExerciceHistoryItemContent({index, set, length}: ExerciceHistoryItemContentProps) {

    function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes} min ${secs.toString().padStart(2, "0")}`;
    }

    return (
        <View>
            <View style={styles.valuesContainer}>
                <View style={styles.valueContainer}>
                    <Text style={styles.value}>{set.weight}</Text>
                    <Text style={styles.valueUnit}> Kg</Text>
                </View>
                <View style={styles.valueContainer}>
                    <Text style={styles.value}>{set.reps}</Text>
                    <Text style={styles.valueUnit}> reps</Text>
                </View>
            </View>
            {index < length - 1 && (
                <View style={styles.restContainer}>
                    <View style={styles.divider}></View>
                    <Text style={styles.rest}>{formatTime(set.rest)}</Text>
                    <View style={styles.divider}></View>
                </View>
            )}
        </View>
    )
}

export default ExerciceHistoryItemContent;

const styles = StyleSheet.create({
    valuesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        fontSize: 16,
        fontFamily: 'Montserrat-semibold',
        color: 'white',
    },
    valueUnit: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat-regular',
    },
    restContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    divider: {
        width: 40,
        height: 2,
        backgroundColor: Colors.primary500,
        marginHorizontal: 5,
    },
    rest: {
        fontSize: 16,
        color: Colors.primary500,
        fontFamily: 'Montserrat-regular',
    },
});