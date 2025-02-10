
import { StyleSheet, View } from 'react-native';
import PrimaryTitle from '../../../components/texts/PrimaryTitle';
import { auth} from '../../../config/firebase';
import Container from '../../../components/Container';
import SecondaryTitle from '../../../components/texts/SecondaryTitle';
import OutlinedButton from '../../../components/ui/buttons/OutlinedButton';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getSessions } from '../../../utils/db';
import LoadingOverlay from '../../../components/ui/LoadingOverlay';
import { Session } from '../../../types/database';
import SessionsList from '../../../components/training/SessionsList';
import { SessionsContext } from '../../../store/sessions-context';

interface SessionsProps {
    navigation: any;
}

function Sessions({navigation}: SessionsProps) {

    const sessionsContext = useContext(SessionsContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    function onStartSessionHandler() {
        navigation.navigate('SessionDetails', {session: sessions[currentIndex]});
    }
    
    const fetchSessions = useCallback(async () => {
        try {
            const userSessions = await getSessions();
            sessionsContext.setSessions(userSessions);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    useEffect(() => {
        setSessions(sessionsContext.sessions);
    }, [sessionsContext.sessions]);

    if (isLoading) {
        return <LoadingOverlay />
    }

    return (
        <Container>
            <View style={styles.rootContainer}>
                <View style={styles.titles}>
                    <PrimaryTitle>Hello {auth.currentUser?.displayName} !</PrimaryTitle>
                    <SecondaryTitle>Select a session for today</SecondaryTitle>
                </View>
                {sessions.length === 0 && (
                    <OutlinedButton onPress={() => {}}>Create Session</OutlinedButton>
                )}
                {sessions.length > 0 && (
                    <>
                        <SessionsList sessions={sessions} onViewableItemsChanged={viewableItemsChanged} />
                        <OutlinedButton style={styles.button} onPress={onStartSessionHandler}>Start</OutlinedButton>
                    </>
                )}
            </View>
        </Container>
    );
}

export default Sessions;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titles: {
        position: 'absolute',
        top: 40,
    },
    button: {
        position: 'absolute',
        bottom: 80,
    }
});