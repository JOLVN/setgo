import { FirebaseDate } from "../types/database";

export function formatDateToString(date: FirebaseDate): string {
    const d = new Date(date.seconds * 1000);
    return d.toLocaleDateString();
}

export function getDayInterval(date: FirebaseDate): number {
    const d = new Date(date.seconds * 1000);
    const today = new Date();

    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - d.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}