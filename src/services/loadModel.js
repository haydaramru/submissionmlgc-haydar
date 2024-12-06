import tf from '@tensorflow/tfjs-node'
import 'dotenv/config'

export const loadModel = async () => {
    return tf.loadGraphModel(process.env.MODEL_URL);
}
