import { connectToDatabase } from '../lib/mongodb';

export const getCollection = async collectionName => {
	try {
		const { database, } = await connectToDatabase();
		if (!database) {
			throw new Error('Database connection failed');
		}

		return database.collection(collectionName);
	} catch (error) {
		console.error('Error in getCollection:', error);
		throw new Error('Failed to get collection');
	}

};
