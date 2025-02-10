import { Animated, FlatList, StyleSheet, View } from "react-native";
import { Session } from "../../types/database";
import SessionItem from "./SessionItem";
import { useRef, useState } from "react";
import Paginator from "../ui/Paginator";

interface SessionsListProps {
    sessions: Session[];
    onViewableItemsChanged: ({ viewableItems }: { viewableItems: any }) => void;
}

function SessionsList({sessions, onViewableItemsChanged}: SessionsListProps) {

    const scrollX = useRef(new Animated.Value(0)).current;
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <View style={styles.container}>
            <FlatList 
                data={sessions} 
                renderItem={({item}) => <SessionItem session={item} />} 
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
            <Paginator data={sessions} scrollX={scrollX} />
        </View>
    )
}

export default SessionsList;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    }
});