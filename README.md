# 🤖 ChatBot Project

Un chatbot intelligent développé avec **Rasa**, **React**, et un backend **Node.js/Express**.  
Ce projet combine NLP (traitement du langage) et une interface utilisateur moderne.

---

## 🚀 Fonctionnalités
- Dialogue intelligent avec Rasa (NLP).
- Interface front-end en **React.jsx**.
- Backend API avec **Node.js** (Express).
- Gestion des utilisateurs et authentification **mongoDB**.
- Déploiement via Docker.

---

## 📦 Installation & Lancement

### Cloner le projet
```bash
git clone https://github.com/Imadzakxy/ChatBot.git
cd ChatBot
```
## backend:
```bash
cd backend
npm install         # Installe les dépendances
npm start           # Lance le backend sur http://localhost:XXXX
```
## Rasa (NLP):
```bash
pip install rasa==3.6.20
rasa train
rasa run actions
rasa shell
```
## Frontend (React):
```bash
cd frontend
npm install
npm run dev
