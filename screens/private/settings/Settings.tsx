import { View } from "react-native";
import LogoutButton from "../../../components/auth/LogoutButton";
import Container from "../../../components/Container";
import SettingLink from "../../../components/ui/SettingLink";

interface SettingsProps {
    navigation: any;
}

function Settings({navigation}: SettingsProps) {
    return (
        <Container>
            <View style={styles.container}>
                <SettingLink onPress={() => navigation.navigate('EditUserName')} iconName="user">Change name</SettingLink>
                <SettingLink onPress={() => navigation.navigate('EditUserPassword')} iconName="lock">Change Password</SettingLink>
                <LogoutButton />
            </View>
        </Container>
    )
}

export default Settings;

const styles = {
    container: {
        marginTop: 40,
    }
}