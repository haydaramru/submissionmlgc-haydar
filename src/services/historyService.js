import { Firestore } from "@google-cloud/firestore"
import 'dotenv/config'

const db = new Firestore({
    keyFilename: 'service_key.json',
    projectId: process.env.PROJECT_ID
});

export const storeHistory = async ({ id, result, suggestion, createdAt }) => {
    try {
        const collection = db.collection('predictions')

        await collection.doc(id).set({
            id,
            result,
            suggestion,
            createdAt
        });

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const getAllHistory = async () => {

    try {
        const collection = db.collection('predictions')

        const snapshot = await collection.get()

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            history: doc.data()
        }));

        return data

    } catch (error) {

    }

}