import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface PrimaryTitleProps {
    children: ReactNode;
    style?: object;
}

function PrimaryTitle({children, style}: PrimaryTitleProps) {
    return (
        <View style={style}>
            <Text style={styles.title}>{children}</Text>
        </View>
    )
}

export default PrimaryTitle;

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Montserrat-bold',
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        marginBottom: 6,
    }
});