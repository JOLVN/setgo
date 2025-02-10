import { Image, StyleSheet, View } from "react-native";

function AppLogo() {
    return (
        <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require('../assets/icon.png')} />
        </View>
    )
}

export default AppLogo;

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logo: {
        width: 70,
        height: 70,
        borderRadius: 10,
    }
});