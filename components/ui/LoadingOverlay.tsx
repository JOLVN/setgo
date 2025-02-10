import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "../../constants/styles";
import Container from "../Container";

function LoadingOverlay() {
    return (
        <Container>
            <View style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </View>
        </Container>
    )
}

export default LoadingOverlay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    }
})