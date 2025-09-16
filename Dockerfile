# Étape 1 - Construction du Frontend React
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json .
RUN npm install
COPY frontend .
RUN npm run build

# Étape 2 - Backend Express
FROM node:18-alpine as backend-builder
WORKDIR /app/backend
COPY backend/package*.json .
RUN npm install
COPY backend .

# Étape 3 - Rasa Chatbot
FROM python:3.8-slim as rasa-builder
WORKDIR /app/rasa-chatbot
COPY rasa-chatbot/requirements.txt .
RUN pip install -r requirements.txt
COPY rasa-chatbot .
RUN rasa train

# Étape finale - Image de production
FROM python:3.8-slim
WORKDIR /app

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    nginx \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copier les artefacts construits
COPY --from=frontend-builder /app/frontend/build ./frontend/build
COPY --from=backend-builder /app/backend ./backend
COPY --from=rasa-builder /app/rasa-chatbot ./rasa-chatbot

# Configurer Nginx
COPY nginx.conf /etc/nginx/sites-available/default

# Installer les dépendances du backend
WORKDIR /app/backend
RUN npm install --production

# Installer les dépendances Rasa
WORKDIR /app/rasa-chatbot
RUN pip install -r requirements.txt

# Configurer Supervisor pour gérer les processus
RUN pip install supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Exposer les ports
EXPOSE 80 5000 5005

# Démarrer les services
CMD ["supervisord", "-n"]