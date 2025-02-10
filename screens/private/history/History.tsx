
import { FlatList, StyleSheet, View } from "react-native";
import Container from "../../../components/Container";
import { fetchHistory } from "../../../utils/db";
import { useCallback, useEffect, useState } from "react";
import LoadingOverlay from "../../../components/ui/LoadingOverlay";
import { UserHistory } from "../../../types/database";
import SecondaryTitle from "../../../components/texts/SecondaryTitle";
import ToggleView from "../../../components/ui/ToggleView";
import ExerciceHistoryItemContent from "../../../components/training/ExerciceHistoryItemContent";
import { useFocusEffect } from "@react-navigation/native";

function History() {

    const [history, setHistory] = useState<UserHistory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [expandedExerciceHistoryIndex, setExpandedExerciceHistoryIndex] = useState<number | null>(null);
    const [expandedDate, setExpandedDate] = useState<string | null>(null);

    const getFullHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const history = await fetchHistory();
            setHistory(history);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            getFullHistory();
        }, [getFullHistory])
    );

    const handleToggle = (date: string, index: number) => {
        setExpandedExerciceHistoryIndex((prevIndex) => (prevIndex === index ? null : index));
        setExpandedDate(date);        
    };

    if (isLoading) {
        return <LoadingOverlay />
    }

    return (
        <Container>
            <View style={styles.container}>
                <FlatList 
                    data={history}
                    keyExtractor={(item) => item.date}
                    renderItem={({item}) => {
                        return (
                            <View>
                                <SecondaryTitle style={styles.secondaryTitle}>{item.date}</SecondaryTitle>
                                {item.exercices.map((exercice, index) => {
                                    const maxHeight = (((exercice.sets.length-1) * 41) + 40 + 26);
                                    return (
                                        <ToggleView 
                                            key={exercice.id}
                                            title={exercice.title} 
                                            maxHeight={maxHeight}
                                            isExpanded={expandedExerciceHistoryIndex === index && expandedDate === item.date}
                                            onToggle={() => handleToggle(item.date, index)}
                                        >
                                            <View style={styles.setsContainer}>
                                                {exercice.sets.map((set, i) => {
                                                    return (
                                                        <ExerciceHistoryItemContent key={set.id} set={set} index={i} length={exercice.sets.length} />
                                                    )
                                                })}
                                            </View>
                                        </ToggleView>
                                    )
                                })}
                            </View>
                        )
                    }}
                />
            </View>
        </Container>
    )
}

export default History;

const styles = StyleSheet.create({
    container: {
        padding: 40,
    },
    setsContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    secondaryTitle: {
        marginVertical: 20,
    }
});