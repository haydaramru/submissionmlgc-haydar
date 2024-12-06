import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { bodyLimit } from 'hono/body-limit'
import crypto from 'crypto'

import { loadModel } from './services/loadModel.js'
import { predictClassification } from './services/inferenceService.js'
import { getAllHistory, storeHistory } from './services/historyService.js'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST']
}));

app.get('/', (c) => {
  return c.json({
    message: 'Hello Hono!'
  })
})

app.post('/predict', bodyLimit({
  maxSize: 1000 * 1024, // 1 MB
  onError: (c) => {
    return c.json({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000"
    }, 413)
  }
}), async (c) => {

  const body = await c.req.parseBody()
  let image = body['image']

  // Jika file bukan image
  if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
    return c.json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi"
    }, 400)
  }

  image = await image.arrayBuffer()
  image = Buffer.from(image);

  const model = await loadModel();

  // Predict
  const result = await predictClassification(model, image)

  if (!result) {
    return c.json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi"
    }, 400)
  }

  const resultPredict = {
    id: crypto.randomUUID(),
    result: result.label,
    suggestion: result.suggestion,
    createdAt: new Date().toISOString()
  }

  // Simpan ke Firestore
  await storeHistory(resultPredict);

  return c.json({
    status: 'success',
    message: 'Model is predicted successfully',
    data: resultPredict
  }, 201);
})

app.get('/predict/histories', async (c) => {
  const data = await getAllHistory();

  return c.json({
    status: 'success',
    data: data
  });
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
