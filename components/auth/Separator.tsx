import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/styles";

function Separator() {
    return (
        <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <Text style={styles.separatorText}>Or continue with</Text>
            <View style={styles.separator} />
        </View>
    )
}

export default Separator;

const styles = StyleSheet.create({
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.gray400,
        flex: 1,
    },
    separatorText: {
        color: Colors.gray500,
        fontFamily: 'Montserrat-regular',
    }
});