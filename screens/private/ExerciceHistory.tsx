import { FlatList, StyleSheet, View } from "react-native";
import PrimaryTitle from "../../components/texts/PrimaryTitle";
import { Exercice, Set, SetHistory } from "../../types/database";
import { useEffect, useState } from "react";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import {fetchSetsHistory} from "../../utils/db";
import SecondaryTitle from "../../components/texts/SecondaryTitle";
import LineChart from "../../components/charts/LineChart";
import ExerciceHistoryItem from "../../components/training/ExerciceHistoryItem";

interface RouteParams {
    key: string;
    name: string;
    params: {
        exercice: Exercice;
    };
};

interface ExerciceHistoryProps {
    navigation: any;
    route: RouteParams;
}


function ExerciceHistory({navigation, route}: ExerciceHistoryProps) {

    const { exercice } = route.params;
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [setsHistory, setSetsHistory] = useState<SetHistory[]>([]);
    const [performanceData, setPerformanceData] = useState<{ x: string, y: number }[]>([]);
    const [expandedSetHistoryIndex, setExpandedSetHistoryIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setExpandedSetHistoryIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    async function getSetsHistory() {
        setIsLoading(true);
        try {
            const sets = await fetchSetsHistory(exercice.id);
            setSetsHistory(sets);
            let chartData = sets.map((set) => {
                const performanceIndex = calculatePerformanceIndex(set.sets);                
                return {
                    x: set.date,
                    y: performanceIndex,
                }
            });
            chartData = chartData.reverse();
            setPerformanceData(chartData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    function calculatePerformanceIndex(sets: Set[]) {
        const volume = sets.reduce((acc, set) => acc + (set.weight * set.reps), 0);
        const totalRest = sets.reduce((acc, set) => acc + set.rest, 0);
        
        const performanceIndex = Math.floor(volume / (1 + Math.log(1 + totalRest)));
        
        return performanceIndex;
    }

    useEffect(() => {
        getSetsHistory();
    }, []);

    if (isLoading) {
        return <LoadingOverlay />
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                {setsHistory.length === 0 && (
                    <View>
                        <PrimaryTitle>{exercice.title}</PrimaryTitle>
                        <View style={styles.emptyHistoryContainer}>
                            <SecondaryTitle>No history yet for this exercice</SecondaryTitle>
                        </View>
                    </View>
                )}
                {setsHistory.length > 0 && (
                    <FlatList
                        ListHeaderComponent={
                            <View style={styles.headerContainer}>
                                <PrimaryTitle>{exercice.title}</PrimaryTitle>
                                {performanceData.length > 1 &&(
                                    <LineChart data={performanceData} />
                                )}
                            </View>
                        }
                        data={setsHistory}
                        keyExtractor={(item) => item.date}
                        renderItem={({item, index}) => {
                            return (
                                <ExerciceHistoryItem setHistory={item} index={index} isExpanded={expandedSetHistoryIndex === index} onToggle={handleToggle} />
                            )
                        }}
                    />
                )}
            </View>
        </View>
    );
}

export default ExerciceHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50,
        gap: 50,
    },
    emptyHistoryContainer: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: [{translateX: '-50%'}, {translateY: '-50%'}],
    },
    headerContainer: {
        gap: 50,
        marginBottom: 50,
    }
});
