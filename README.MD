# Dokumentasi API Cancer Service

## Gambaran Umum

**Cancer Service API** dikembangkan sebagai proyek akhir untuk kelas **Dicoding: Belajar Penerapan Machine Learning dengan Google Cloud**.  
API ini menyediakan endpoint untuk memprediksi kemungkinan kanker berdasarkan gambar yang diunggah dan mengambil riwayat prediksi.  
Layanan ini menggunakan model machine learning yang telah dilatih dan diimplementasikan pada Google Cloud.

---

---

## Base URL

```
http://localhost:3000
```

---

## Endpoints

### 1. Prediksi Kanker

**URL:** `/predict`  
**Method:** `POST`  
**Content-Type:** `multipart/form-data`

#### Request Body:

- `image` (file): The uploaded image file. Maximum size is **1MB** (1000000 bytes).

#### Responses:

- **Sukses (Kanker terdeteksi):**

  ```json
  {
    "status": "success",
    "message": "Model is predicted successfully",
    "data": {
      "id": "77bd90fc-c126-4ceb-828d-f048dddff746",
      "result": "Cancer",
      "suggestion": "Segera periksa ke dokter!",
      "createdAt": "2023-12-22T08:26:41.834Z"
    }
  }
  ```

- **Sukses (Kanker tidak terdeteksi):**

  ```json
  {
    "status": "success",
    "message": "Model is predicted successfully",
    "data": {
      "id": "77bd90fc-c126-4ceb-828d-f048dddff746",
      "result": "Non-cancer",
      "suggestion": "Penyakit kanker tidak terdeteksi.",
      "createdAt": "2023-12-22T08:26:41.834Z"
    }
  }
  ```

- **Error (File terlalu besar maksimal 1MB):**

  - **Status Code:** `413`
  - **Response Body:**
    ```json
    {
      "status": "fail",
      "message": "Payload content length greater than maximum allowed: 1000000"
    }
    ```

- **Error (Gambar tidak sesuai atau Gagal Prediksi):**
  - **Status Code:** `400`
  - **Response Body:**
    ```json
    {
      "status": "fail",
      "message": "Terjadi kesalahan dalam melakukan prediksi"
    }
    ```

---

### 2. Riwayat Prediksi

**URL:** `/predict/histories`  
**Method:** `GET`

#### Response Body:

```json
{
  "status": "success",
  "data": [
    {
      "id": "13e907b3-4213-42ad-b12b-b9b7e12eb90e",
      "history": {
        "result": "Cancer",
        "createdAt": "2023-12-22T10:04:40.341Z",
        "suggestion": "Segera periksa ke dokter!",
        "id": "13e907b3-4213-42ad-b12b-b9b7e12eb90e"
      }
    },
    {
      "id": "19555e44-9cc7-4bc4-98b9-732d69cac082",
      "history": {
        "result": "Non-cancer",
        "createdAt": "2023-12-22T10:06:50.783Z",
        "suggestion": "Anda sehat!",
        "id": "19555e44-9cc7-4bc4-98b9-732d69cac082"
      }
    }
  ]
}
```
