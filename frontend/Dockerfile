FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite a besoin de ce port
EXPOSE 5173

# On lance vite avec --host pour autoriser l'accès externe au conteneur
CMD ["npm", "run", "dev", "--", "--host"]