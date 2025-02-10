export interface FirebaseDate {
    seconds: number;
    nanoseconds: number;
}

export interface Session {
    id: string;
    title: string;
    lastTrainingDate?: FirebaseDate;
    userId: string;
}

export interface ExerciceCategory {
    id: string;
    title: string;
    index: number;
    sessionId: string;
    userId: string;
}

export interface Exercice {
    id: string;
    title: string;
    index: number;
    goal?: string;
    lastTrainingDate?: FirebaseDate;
    categoryId: string;
    sessionId: string;
    userId: string;
}

export interface FilteredExerciceCategory {
    id: string;
    title: string;
    index: number;
    sessionId: string;
    userId: string;
    exercices: Exercice[] | [];
}

export interface FilteredSession {
    id: string;
    title: string;
    lastTrainingDate?: FirebaseDate;
    userId: string;
    exerciceCategories: FilteredExerciceCategory[];
}

export interface Set {
    id: string;
    exerciceId: string;
    exerciceTitle: string;
    userId: string;
    index: number;
    weight: number;
    reps: number;
    rest: number;
    date: FirebaseDate;
}

export interface SetHistory {
    date: string;
    sets: Set[];
}

export interface UserHistory {
    date: string;
    exercices: {
        id: string,
        title: string,
        sets: Set[];
    }[];
}