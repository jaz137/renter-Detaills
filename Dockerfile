# Usa una imagen base de Node.js
FROM node:18-alpine

# Crea y usa un directorio de trabajo
WORKDIR /app

# Copia archivos de proyecto
COPY . .

# Instala pnpm
RUN npm install -g pnpm

# Instala dependencias
RUN pnpm install

# Construye la app Next.js
RUN pnpm build

# Expone el puerto por defecto de Next.js
EXPOSE 3000

# Comando para iniciar la app
CMD ["pnpm", "start"]
