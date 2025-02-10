import { createContext, useReducer } from "react";
import { FilteredExerciceCategory, FilteredSession, Session } from "../types/database";
import { Timestamp } from "firebase/firestore";

interface SessionsContextType {
    sessions: Session[] | FilteredSession[];
    setSessions: (sessions: Session[]) => void;
    addSession: (id: string, name: string) => void;
    updateSession: (session: FilteredSession) => void;
    updateLastTrainingDate: (sessionId: string, categoryId: string, exerciceId: string) => void;
    updateExerciceGoal: (sessionId: string, categoryId: string, exerciceId: string, goal: string) => void;
    deleteSession: (sessionId: string) => void;
}

export const SessionsContext = createContext({
    sessions: [],
    setSessions: (sessions: Session[]) => { },
    addSession: (id: string, name: string) => { },
    updateSession: (session: FilteredSession) => { },
    updateLastTrainingDate: (sessionId: string, categoryId: string, exerciceId: string) => { },
    updateExerciceGoal: (sessionId: string, categoryId: string, exerciceId: string, goal: string) => { },
    deleteSession: (sessionId: string) => { },
} as SessionsContextType);

interface ReducerAction {
    type: string;
    payload: any;
}

function SessionsReducer(state: Session[], action: ReducerAction) {
    switch (action.type) {
        case 'SET_SESSIONS':
            return action.payload;
        case 'ADD_SESSION':
            return [action.payload, ...state];
        case 'UPDATE_SESSION':
            return state.map(session => 
                session.id === action.payload.id
                    ? {
                        ...action.payload,
                        exerciceCategories: action.payload.exerciceCategories.filter((category: FilteredExerciceCategory) => 
                            category.exercices.length > 0
                        )
                    }
                    : session
            );
        case 'UPDATE_LAST_TRAINING_DATE':
            return state.map(session => 
                session.id === action.payload.sessionId
                    ? {
                        ...session,
                        lastTrainingDate: Timestamp.now(),
                        exerciceCategories: (session as FilteredSession).exerciceCategories.map(category => 
                            category.id === action.payload.categoryId
                                ? {
                                    ...category,
                                    exercices: category.exercices.map(exercice => 
                                        exercice.id === action.payload.exerciceId
                                            ? {
                                                ...exercice,
                                                lastTrainingDate: Timestamp.now()
                                            }
                                            : exercice
                                    )
                                }
                                : category
                        )
                    }
                    : session
            );
        case 'UPDATE_EXERCICE_GOAL':
            return state.map(session => 
                session.id === action.payload.sessionId
                    ? {
                        ...session,
                        exerciceCategories: (session as FilteredSession).exerciceCategories.map(category => 
                            category.id === action.payload.categoryId
                                ? {
                                    ...category,
                                    exercices: category.exercices.map(exercice => 
                                        exercice.id === action.payload.exerciceId
                                            ? {
                                                ...exercice,
                                                goal: action.payload.goal
                                            }
                                            : exercice
                                    )
                                }
                                : category
                        )
                    }
                    : session
            );
        case 'DELETE_SESSION':
            return state.filter(session => session.id !== action.payload);
        default:
            return state;
    }
}

interface SessionsContextProviderProps {
    children: React.ReactNode
}

function SessionsContextProvider({children}: SessionsContextProviderProps) {

    const [sessions, dispatch] = useReducer(SessionsReducer, []);

    function setSessions(sessionsData: Session[]) {
        dispatch({
            type: 'SET_SESSIONS',
            payload: sessionsData
        });
    }

    function addSession(id: string, name: string) {
        dispatch({
            type: 'ADD_SESSION',
            payload: {
                id: id,
                title: name,
                lastTrainingDate: null,
            }
        });
    }

    function updateSession(session: FilteredSession) {
        dispatch({
            type: 'UPDATE_SESSION',
            payload: session
        });
    }

    function updateLastTrainingDate(sessionId: string, categoryId: string, exerciceId: string) {
        dispatch({
            type: 'UPDATE_LAST_TRAINING_DATE',
            payload: {
                sessionId,
                categoryId,
                exerciceId
            }
        });
    }

    function updateExerciceGoal(sessionId: string, categoryId: string, exerciceId: string, goal: string) {
        dispatch({
            type: 'UPDATE_EXERCICE_GOAL',
            payload: {
                sessionId,
                categoryId,
                exerciceId,
                goal
            }
        });
    }

    function deleteSession(sessionId: string) {
        dispatch({
            type: 'DELETE_SESSION',
            payload: sessionId
        });
    }

    const value = {
        sessions,
        setSessions,
        addSession,
        updateSession,
        updateLastTrainingDate,
        updateExerciceGoal,
        deleteSession,
    }
    
    return (
        <SessionsContext.Provider value={value}>
            {children}
        </SessionsContext.Provider>
    );
}

export default SessionsContextProvider;