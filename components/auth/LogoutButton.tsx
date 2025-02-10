import { Alert } from "react-native";
import { logoutUser } from "../../utils/auth";
import FlatButton from "../ui/buttons/FlatButton";

function LogoutButton() {

    function onLogout() {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    logoutUser();
                }
            }
        ])
    }

    return (
        <FlatButton onPress={onLogout} red={true}>Logout</FlatButton>
    )
}

export default LogoutButton;