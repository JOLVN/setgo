import { useRoute } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { FilteredSession, Session } from "../../../types/database";
import { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import SecondaryTitle from "../../../components/texts/SecondaryTitle";
import { getSessionData } from "../../../utils/db";
import ExerciceCategories from "../../../components/training/ExerciceCategories";
import LoadingOverlay from "../../../components/ui/LoadingOverlay";
import Container from "../../../components/Container";
import OutlinedButton from "../../../components/ui/buttons/OutlinedButton";
import FlatButton from "../../../components/ui/buttons/FlatButton";
import { SessionsContext } from "../../../store/sessions-context";

interface RouteParams {
    key: string;
    name: string;
    params: {
        session: Session;
    };
};

interface SessionDetailsProps {
    navigation: any;
}

function SessionDetails({navigation}: SessionDetailsProps) {    

    const sessionsContext = useContext(SessionsContext);
    const route = useRoute<RouteParams>();
    const { session } = route.params;
    const [sessionData, setSessionData] = useState<FilteredSession>({
        id: session.id,
        title: session.title,
        userId: session.userId,
        exerciceCategories: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: sessionData.title,
            headerRight: () => (
                <FlatButton onPress={ isLoading ? () => { } : onEditSession} disabled={isLoading}>Edit</FlatButton>
            )
        })
    }, [navigation, isLoading, sessionData]);

    function onEditSession() {
        navigation.navigate('EditSession', {session: sessionData});
    }

    const fetchSessionData = useCallback(async () => {
        const sessionContextData = sessionsContext.sessions.find(s => s.id === session.id);
        if (sessionContextData && (sessionContextData as any).exerciceCategories) {
            setIsLoading(false);
            return;
        } else {
            try {                
                const sessionData = await getSessionData(session.id);
                sessionsContext.updateSession(sessionData);
                setSessionData(sessionData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [session.id]);

    useEffect(() => {
        fetchSessionData();
    }, [fetchSessionData]);

    useEffect(() => {
        const sessionContextData = sessionsContext.sessions.find(s => s.id === session.id);
        setSessionData(sessionContextData as FilteredSession);
    }, [sessionsContext.sessions]);

    if (isLoading) {
        return <LoadingOverlay />
    }

    return (
        <Container>
            {sessionData.exerciceCategories?.length === 0 && (
                <View style={styles.container}>
                    <SecondaryTitle>No exercices found for this session</SecondaryTitle>
                    <OutlinedButton onPress={onEditSession}>Create your exercices</OutlinedButton>
                </View>
            )}
            {sessionData.exerciceCategories?.length > 0 && (
                <>
                    <SecondaryTitle style={styles.title}>Select a session</SecondaryTitle>
                    <ExerciceCategories exerciceCategories={sessionData.exerciceCategories} />
                </>
            )}
        </Container>
    )
}

export default SessionDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    title: {
        marginVertical: 50,
    }
});
