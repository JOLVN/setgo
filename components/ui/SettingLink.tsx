import { Image, Pressable, Text, View } from "react-native";
import { FontAwesome } from '@expo/vector-icons';


interface SettingLinkProps {
    onPress: () => void;
    children: string;
    iconName: string;
}

function SettingLink({ onPress, children, iconName }: SettingLinkProps)  {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                    <FontAwesome name={iconName as any} size={24} color="white" />
                    <Text style={styles.text}>{children}</Text>
                </View>
                <Image style={styles.chevron} source={require('../../assets/icons/chevron-down.png')} />
            </View>
        </Pressable>
    )
}

export default SettingLink;

const styles = {
    container: {
        paddingVertical: 20,
        paddingHorizontal: 40,
    },
    innerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chevron: {
        width: 18,
        height: 18,
        transform: [{ rotate: '-90deg' }]
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat-regular',
    }
}