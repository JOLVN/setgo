import { createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, signInWithPopup, updatePassword, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { Credentials } from "../types/credentials";
import { Alert } from "react-native";

export async function createUser(credentials: Credentials) {
    const { name, email, password } = credentials;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update the user's profile with their name
        if (user && name) {
            await updateProfile(user, {
                displayName: name,
            });
        }
    } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
            Alert.alert("Email Already in Use", "This email address is already registered. Please use another email or log in.");
        } else {
            Alert.alert("An Error Occurred", "Something went wrong. Please try again.");
        }
    }
}

export async function loginUser(credentials: Credentials) {
    const { email, password } = credentials;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error);
    }

}

export async function signInWithGoogle() {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error(error);
    }
}

export async function logoutUser() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error(error);
    }
}

export async function updateUserName(newName: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
        Alert.alert("Not Logged In", "You need to be logged in execute this action.");
        return;
    }
    try {
        await updateProfile(user, { displayName: newName });
    } catch (error) {
        console.error("Error updating user name: ", error);
        throw error;
    }
}

export async function updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) {
        Alert.alert("Not Logged In", "You need to be logged in execute this action.");
        return;
    }
    try {
        // Reauthenticate the user
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Update the password
        await updatePassword(user, newPassword);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe :", error);
        throw error;
    }
}