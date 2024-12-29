import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { bodyLimit } from 'hono/body-limit'
import crypto from 'crypto'

// Services
import { loadModel } from './services/loadModel.js'
import { predictClassification } from './services/inferenceService.js'
import { getAllHistory, storeHistory } from './services/historyService.js'

// Create the Hono app
const app = new Hono()

// Enable CORS (allow any origin to POST/GET)
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST']
}))

// Health check endpoint
app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' })
})

// Prediction endpoint
app.post(
  '/predict',
  // Optional: limit request body to ~1MB
  bodyLimit({
    maxSize: 1000 * 1024, // 1 MB
    onError: (c) => {
      return c.json(
        {
          status: 'fail',
          message: 'Payload content length greater than maximum allowed: 1000000'
        },
        413 // Payload Too Large
      )
    }
  }),
  async (c) => {
    try {
      // Parse multipart/form-data
      const formData = await c.req.formData()
      // "image" must match the key used in Postman
      const file = formData.get('image')

      if (!file) {
        return c.json({ status: 'fail', message: 'No file uploaded' }, 400)
      }

      // Check MIME type
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        return c.json({
          status: 'fail',
          message: 'File must be PNG or JPEG'
        }, 400)
      }

      // Convert the file into a Buffer
      const buffer = Buffer.from(await file.arrayBuffer())

      // Load the TensorFlow model
      const model = await loadModel()

      // Run prediction
      const result = await predictClassification(model, buffer)
      if (!result) {
        return c.json({
          status: 'fail',
          message: 'Terjadi kesalahan dalam melakukan prediksi'
        }, 400)
      }

      // Create a record
      const resultPredict = {
        id: crypto.randomUUID(),
        result: result.label,
        suggestion: result.suggestion,
        createdAt: new Date().toISOString()
      }

      // Save to Firestore
      await storeHistory(resultPredict)

      // Return success
      return c.json({
        status: 'success',
        message: 'Model is predicted successfully',
        data: resultPredict
      }, 201)
    } catch (error) {
      console.error(error)
      return c.json({
        status: 'fail',
        message: error.message || 'Internal Server Error'
      }, 500)
    }
  }
)

// Get all prediction histories
app.get('/predict/histories', async (c) => {
  try {
    const data = await getAllHistory()
    return c.json({
      status: 'success',
      data
    })
  } catch (error) {
    console.error(error)
    return c.json({ status: 'fail', message: 'Could not fetch histories' }, 500)
  }
})

// Listen on Cloud Run’s default port OR local port 3000
const port = process.env.PORT || 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
