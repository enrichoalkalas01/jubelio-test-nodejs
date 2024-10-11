# Menggunakan base image node yang mendukung ARM
FROM node:18-alpine

# Menentukan working directory di container
WORKDIR /usr/src/app

# Menginstall alat yang diperlukan untuk membangun ulang bcrypt
RUN apk add --no-cache --virtual .gyp python3 make g++

# Meng-copy file package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Menginstall dependencies, termasuk bcrypt, dengan build ulang
RUN npm install
RUN npm install bcrypt
RUN npm install bcryptjs
RUN npm install --save @types/bcryptjs

# Meng-copy seluruh project ke dalam container
COPY . .

# Perbaikan pada CMD
CMD ["sh", "-c", "npm run migrate -- --all && npx ts-node src/server.ts"]

# Mengekspos port yang digunakan oleh aplikasi
EXPOSE 5700
