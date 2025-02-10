import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, Timestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { auth, firestore } from "../config/firebase";
import { Exercice, ExerciceCategory, FilteredExerciceCategory, FilteredSession, Session, Set, SetHistory, UserHistory } from "../types/database";
import { Alert } from "react-native";

function getUserId(): string | null {
    const user = auth.currentUser;
    if (!user) {
        Alert.alert("Not Logged In", "You need to be logged in execute this action.");
        return null;
    }
    return user.uid;
}

export async function getSessions(): Promise<Session[]> {
    const userId = getUserId();
    if (!userId) return [];
    try {
        const sessionsCollectionRef = collection(firestore, 'sessions');
        const q = query(sessionsCollectionRef, 
            where("userId", "==", userId), 
            orderBy('lastTrainingDate', 'asc'));
        const data = await getDocs(q);
        const sessions = data.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Session[];
        return sessions;
        
    } catch (error) {
        console.error("Error fetching sessions:", error);
        throw error;
    }
}

export async function createSession(name: string) {
    const userId = getUserId();
    if (!userId) return;
    try {
        const response = await addDoc(collection(firestore, "sessions"), {
            userId,
            title: name,
            lastTrainingDate: null
        });
        return response.id;
    } catch (error) {
        console.error("Error creating session:", error);
        throw error;
    }
}

async function getExerciceCategories(sessionId: string): Promise<ExerciceCategory[]> {
    const userId = getUserId();
    if (!userId) return [];
    try {
        const categoriesCollectionRef = collection(firestore, "exercice_categories");
        const categoriesQuery = query(
            categoriesCollectionRef,
            where("sessionId", "==", sessionId),
            where("userId", "==", userId),
            orderBy('index', 'asc')
        );
        const categoriesData = await getDocs(categoriesQuery);

        const categories = categoriesData.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ExerciceCategory[];
            
        return categories;
    } catch (error) {
        console.error("Error fetching exercice categories:", error);
        throw error;
    }
}

async function getExercices(sessionId: string): Promise<Exercice[]> {
    const userId = getUserId();
    if (!userId) return [];
    try {
        const exercicesCollectionRef = collection(firestore, "exercices");
        const exercicesQuery = query(
            exercicesCollectionRef,
            where("sessionId", "==", sessionId),
            where("userId", "==", userId),
            orderBy('index', 'asc')
        );
        const exercicesData = await getDocs(exercicesQuery);

        const exercices = exercicesData.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Exercice[];

        return exercices;
    } catch (error) {
        console.error("Error fetching exercices:", error);
        throw error;
    }
}


export async function getSessionData(sessionId: string): Promise<FilteredSession> {
    const userId = getUserId();
    if (!userId) return {} as FilteredSession;
    try {
        // Get session
        const sessionDocRef = doc(firestore, "sessions", sessionId);
        const sessionDoc = await getDoc(sessionDocRef);

        if (!sessionDoc.exists()) {
            throw new Error(`Session with ID ${sessionId} not found`);
        }

        const session = {
            id: sessionDoc.id,
            ...sessionDoc.data(),
        } as Session;

        const categories = await getExerciceCategories(sessionId);
        const exercices = await getExercices(sessionId);

        // Filter exercices by category
        const categoriesWithExercices = categories.map((category) => {
            const categoryExercices = exercices.filter(
                (exercice) => exercice.categoryId === category.id
            );
            return {
                ...category,
                exercices: categoryExercices,
            };
        });

        return {
            ...session,
            exerciceCategories: categoriesWithExercices,
        };
    } catch (error) {
        console.error("Error fetching session data:", error);
        throw error;
    }
}


export async function updateSessionData(sessionData: FilteredSession) {
    try {
        const batch = writeBatch(firestore);
        const updatedSession = { ...sessionData, exerciceCategories: [] as FilteredExerciceCategory[] };

        // Update session title
        const sessionRef = doc(firestore, "sessions", sessionData.id);
        batch.update(sessionRef, { title: sessionData.title });

        const existingCategories = await getExerciceCategories(sessionData.id);
        const existingExercices = await getExercices(sessionData.id);

        const categoryIds = sessionData.exerciceCategories.map((category) => category.id);

        // Update each category title and its exercises titles
        sessionData.exerciceCategories.forEach((category) => {
            
            let categoryId = category.id;
            if (categoryId === '') return;
            if (category.exercices.length === 0) return;
            if (category.title === '') return;
            if (categoryId.length < 14) {
                // Add new category
                const newCategoryRef = doc(collection(firestore, "exercice_categories"));
                categoryId = newCategoryRef.id;

                batch.set(newCategoryRef, {
                    title: category.title,
                    index: category.index,
                    userId: sessionData.userId,
                    sessionId: sessionData.id,
                });
            } else {
                // Update category title
                const categoryRef = doc(firestore, "exercice_categories", category.id);
                batch.update(categoryRef, { title: category.title });
            }

            const exerciceIds = category.exercices.map((exercice) => exercice.id);

            // Update exercises within the category
            const newExercises = category.exercices.map((exercice) => {
                let exerciceId = exercice.id;
                
                if (exercice.title === '') return null;
                if (exercice.id.length < 14) {
                    // Add new exercice
                    const newExerciceRef = doc(collection(firestore, "exercices"));
                    exerciceId = newExerciceRef.id;

                    batch.set(newExerciceRef, {
                        title: exercice.title,
                        index: exercice.index,
                        goal: null,
                        lastTrainingDate: null,
                        userId: sessionData.userId,
                        categoryId: categoryId,
                        sessionId: sessionData.id,
                    });
                } else {
                    // Update exercice title
                    const exerciceRef = doc(firestore, "exercices", exercice.id);
                    batch.update(exerciceRef, { title: exercice.title });
                }

                return { ...exercice, id: exerciceId, categoryId };
            });

            updatedSession.exerciceCategories.push({
                ...category,
                id: categoryId,
                exercices: newExercises as Exercice[],
            });

            // Delete exercises that are no longer in the category
            const exercicesToDelete = existingExercices.filter(
                (exercice) => exercice.categoryId === category.id && !exerciceIds.includes(exercice.id)
            );
            exercicesToDelete.forEach((exercice) => {
                const exerciceRef = doc(firestore, "exercices", exercice.id);
                batch.delete(exerciceRef);
            });
        });

        // Delete categories that are no longer in the session
        const categoriesToDelete = existingCategories.filter(
            (category) => !categoryIds.includes(category.id)
        );
        categoriesToDelete.forEach((category) => {
            const categoryRef = doc(firestore, "exercice_categories", category.id);
            batch.delete(categoryRef);

            // Delete exercises in the category
            const exercicesInCategory = existingExercices.filter((exercice) => exercice.categoryId === category.id);
            exercicesInCategory.forEach((exercice) => {
                const exerciceRef = doc(firestore, "exercices", exercice.id);
                batch.delete(exerciceRef);
            });
        });

        await batch.commit();
        
        return updatedSession;
    } catch (error) {
        console.error("Error updating titles:", error);
        throw new Error("Failed to update session, categories, or exercises titles.");
    }
}

export async function deleteSession(sessionId: string) {
    const userId = getUserId();
    if (!userId) return;
    try {
        const batch = writeBatch(firestore);

        const sessionRef = doc(firestore, "sessions", sessionId);
        batch.delete(sessionRef);

        const categories = await getExerciceCategories(sessionId);
        const exercices = await getExercices(sessionId);

        categories.forEach((category) => {
            const categoryRef = doc(firestore, "exercice_categories", category.id);
            batch.delete(categoryRef);

            const exercicesInCategory = exercices.filter((exercice) => exercice.categoryId === category.id);
            exercicesInCategory.forEach((exercice) => {
                const exerciceRef = doc(firestore, "exercices", exercice.id);
                batch.delete(exerciceRef);
            });
        });

        await batch.commit();
    } catch (error) {
        console.error("Error deleting session:", error);
        throw error;
    }
}

export async function getTodaySets(exerciceId: string) {
    const userId = getUserId();
    if (!userId) return [];
    try {
        const exercicesRef = collection(firestore, "sets");

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Midnight
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const q = query(
            exercicesRef,
            where("userId", "==", userId),
            where("exerciceId", "==", exerciceId),
            where("date", ">=", today),
            where("date", "<", tomorrow),
            orderBy('index', 'asc')
        );
        
        const data = await getDocs(q);
        return data.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }) as Set);
    } catch (error) {
        console.error("Error fetching today's sets:", error);
        throw error;
    }
}

export async function createSet(exerciceId: string, exerciceTitle: string, index: number, weight: number, reps: number, rest: number) {
    const userId = getUserId();
    if (!userId) return;
    try {
        const setsRef = collection(firestore, "sets");
        await addDoc(setsRef, {
            userId,
            exerciceId,
            exerciceTitle,
            index,
            reps,
            weight,
            rest,
            date: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error creating set:", error);
        throw error;
    }
}

export async function getLastSet(exerciceId: string) {
    const userId = getUserId();
    if (!userId) return null;
    try {
        const setsRef = collection(firestore, "sets");
        const q = query(
            setsRef,
            where("userId", "==", userId),
            where("exerciceId", "==", exerciceId),
            orderBy("date", "desc"),
            limit(1)
        );

        const data = await getDocs(q);
        
        if (!data.empty) {
            return {
                id: data.docs[0].id,
                ...data.docs[0].data(),
            } as Set;
        } else {
            return null;
        }
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du dernier set :", error);
        throw error;
    }
}

export async function updateSessionLastTrainingDate(sessionId: string) {
    try {
        const sessionRef = doc(firestore, "sessions", sessionId);
        await updateDoc(sessionRef, {
            lastTrainingDate: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error updating session last training date:", error);
        throw error;
    }
}

export async function updateExerciceLastTrainingDate(exerciceId: string) {
    try {
        const exerciceRef = doc(firestore, "exercices", exerciceId);
        await updateDoc(exerciceRef, {
            lastTrainingDate: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error updating exercice last training date:", error);
        throw error;
    }
}

export async function updateExerciceGoal(exerciceId: string, goal: string) {
    try {
        const exerciceRef = doc(firestore, "exercices", exerciceId);
        await updateDoc(exerciceRef, {
            goal,
        });
    } catch (error) {
        console.error("Error updating exercice goal:", error);
        throw error;
    }
}

export async function fetchSetsHistory(exerciceId: string) {
    const userId = getUserId();
    if (!userId) return [];
    const setsRef = collection(firestore, 'sets');
    
    const q = query(
        setsRef,
        where('userId', '==', userId),
        where('exerciceId', '==', exerciceId),
        orderBy('date', 'desc')
    );

    const data = await getDocs(q);
    const sets: Set[] = [];
    
    data.forEach(doc => {
        sets.push({ id: doc.id, ...doc.data() } as Set);
    });
    
    // Group sets by date
    const groupedSets = sets.reduce((acc, set) => {
        const date = new Date(set.date.seconds * 1000).toISOString().split('T')[0];
        const existingSet = acc.find(s => s.date === date);
        if (existingSet) {
            existingSet.sets.push(set);
        } else {
            acc.push({ date, sets: [set] });
        }
        return acc;
    }
    , [] as SetHistory[]);

    // Sort sets by index
    groupedSets.forEach(group => {
        group.sets.sort((a, b) => a.index - b.index);
    });
    
    return groupedSets;
}

export async function fetchHistory(): Promise<UserHistory[]> {
    const userId = getUserId();
    if (!userId) return [];

    const setsRef = collection(firestore, "sets");

    const setsQuery = query(
        setsRef,
        where("userId", "==", userId),
        orderBy("date", "desc")
    );

    const setsData = await getDocs(setsQuery);
    const sets: Set[] = setsData.docs.map(doc => ({ id: doc.id, ...doc.data() } as Set));

    const historyMap = new Map<string, Map<string, { title: string; sets: Set[] }>>();

    sets.forEach(set => {
        const setDate = new Date(set.date.seconds * 1000).toISOString().split('T')[0];

        if (!historyMap.has(setDate)) {
            historyMap.set(setDate, new Map());
        }
        const exercicesMap = historyMap.get(setDate)!;

        if (!exercicesMap.has(set.exerciceId)) {
            exercicesMap.set(set.exerciceId, { title: set.exerciceTitle, sets: [] });
        }
        exercicesMap.get(set.exerciceId)!.sets.push(set);
    });

    // Convert map to array
    const history: UserHistory[] = Array.from(historyMap.entries()).map(([date, exercicesMap]) => ({
        date,
        exercices: Array.from(exercicesMap.entries()).map(([id, { title, sets }]) => ({
            id,
            title,
            sets,
        })),
    }));

    return history;
}
