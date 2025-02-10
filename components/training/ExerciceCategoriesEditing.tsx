import { Animated, FlatList, View } from "react-native";
import { FilteredSession } from "../../types/database";
import { useRef } from "react";
import ExerciceCategoryEditing from "./ExerciceCategoryEditing";
import Paginator from "../ui/Paginator";

interface ExerciceCategoriesProps {
    sessionData: FilteredSession;
    setSessionData: (sessionData: FilteredSession) => void;
    onViewableItemsChanged: ({ viewableItems }: { viewableItems: any }) => void;
}

function ExerciceCategoriesEditing({sessionData, setSessionData, onViewableItemsChanged}: ExerciceCategoriesProps) {

    const scrollX = useRef(new Animated.Value(0)).current;
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <View>
            <FlatList 
                data={sessionData.exerciceCategories} 
                renderItem={({item}) => <ExerciceCategoryEditing exerciceCategoryIndex={item.index} sessionData={sessionData} setSessionData={setSessionData} />} 
                keyExtractor={item => item.id} 
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                bounces={false}
                onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {useNativeDriver: false})}
                viewabilityConfig={viewConfig}
                scrollEventThrottle={32}
                onViewableItemsChanged={onViewableItemsChanged}
            />
            <Paginator data={sessionData.exerciceCategories} scrollX={scrollX} style={{ bottom: -15 }} />
        </View>
    )
}

export default ExerciceCategoriesEditing;
