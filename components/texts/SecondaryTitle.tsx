import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface SecondaryTitleProps {
    children: ReactNode;
    style?: object;
}

function SecondaryTitle({children, style}: SecondaryTitleProps) {
    return (
        <View style={style}>
            <Text style={styles.title}>{children}</Text>
        </View>
    )
}

export default SecondaryTitle;

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Montserrat-regular',
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
    }
});