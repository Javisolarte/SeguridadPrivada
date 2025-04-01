FROM node:16  

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto
COPY package*.json ./

# Instalar las dependencias de la API
RUN npm install

# Instalar el cliente de PostgreSQL
RUN apt-get update && apt-get install -y postgresql-client

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la API
CMD ["node", "server.js"]
