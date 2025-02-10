import { StyleSheet, Text, View } from "react-native"
import ToggleView from "../ui/ToggleView"
import { SetHistory } from "../../types/database";
import ExerciceHistoryItemContent from "./ExerciceHistoryItemContent";

interface ExerciceHistoryItemProps {
    setHistory: SetHistory;
    index: number;
    isExpanded: boolean;
    onToggle: (index: number) => void;
}

function ExerciceHistoryItem({setHistory, index, isExpanded, onToggle}: ExerciceHistoryItemProps) {

    const maxHeight = (((setHistory.sets.length-1) * 41) + 40 + 26);

    return (
        <ToggleView 
            title={setHistory.date} 
            maxHeight={maxHeight}
            isExpanded={isExpanded}
            onToggle={() => onToggle(index)}
        >
            <View style={styles.setsContainer}>
                {setHistory.sets.map((set, i) => {
                    return (
                        <ExerciceHistoryItemContent set={set} index={i} length={setHistory.sets.length} key={set.id} />
                    )
                })}
            </View>
        </ToggleView>
    )
}

export default ExerciceHistoryItem;

const styles = StyleSheet.create({
    setsContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
    }
});