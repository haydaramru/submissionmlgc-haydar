import tf from '@tensorflow/tfjs-node'

export const predictClassification = async (model, image) => {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const label = confidenceScore <= 50 ? 'Non-cancer' : 'Cancer';
        let suggestion;

        if (label === 'Cancer') {
            suggestion = "Segera periksa ke dokter!"
        }

        if (label === 'Non-cancer') {
            suggestion = "Penyakit kanker tidak terdeteksi."
        }

        return { label, suggestion };
    } catch (error) {
        return null;
    }
}