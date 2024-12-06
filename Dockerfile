# Gunakan image Node.js resmi sebagai base image
FROM node:iron-bullseye

# Set direktori kerja dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh kode sumber ke dalam container
COPY . .

# Expose port yang akan digunakan oleh aplikasi
EXPOSE 3000

# Tentukan perintah untuk menjalankan aplikasi
CMD [ "npm", "start" ]