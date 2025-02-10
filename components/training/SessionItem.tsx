import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { FirebaseDate, Session } from "../../types/database";
import { Colors } from "../../constants/styles";
import { formatDateToString } from "../../utils/date";

interface SessionItemProps {
    session: Session;
}

function SessionItem({session}: SessionItemProps) {

    const { width } = useWindowDimensions();

    return (
        <View style={{width}}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>{session.title}</Text>
                <View style={styles.lastSessionContainer}>
                    <Text style={styles.text}>Last session : </Text>
                    {session.lastTrainingDate && (
                        <Text style={[styles.text, styles.date]}>{formatDateToString(session.lastTrainingDate)}</Text>
                    )}
                    {!session.lastTrainingDate && (
                        <Text style={[styles.text, styles.date]}>----------</Text>
                    )}
                </View>
            </View>
        </View>
    )
}

export default SessionItem;

const styles = StyleSheet.create({
    innerContainer: {
        margin: 24,
        paddingVertical: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: Colors.background500,
    },
    title: {
        fontSize: 30,
        color: Colors.primary500,
        fontFamily: 'Montserrat-bold',
    },
    lastSessionContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    text: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Montserrat-medium',
    },
    date: {
        fontFamily: 'Montserrat-bold',
    }
});