# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

How to run the project locally:

Node.js Local Setup Checklist
1️⃣ Install Node.js

Download LTS version: https://nodejs.org/

Verify installation:

node -v
npm -v

2️⃣ Open project folder
cd path/to/your/project/backend

3️⃣ Install dependencies
npm install

4️⃣ Create .env file

In the backend folder, create .env:

GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PORT=4000

5️⃣ Run the server

Option 1 (regular):

node server.js


Option 2 (auto-reload on changes):

npm install -g nodemon
nodemon server.js


You should see:

🚀 Server running on http://localhost:4000

6️⃣ Test the API

Using curl:

curl -X POST http://localhost:4000/api/plan \
-H "Content-Type: application/json" \
-d '{"name":"John","ethnicity":"Indian","budget":50000,"interests":["beach","food"],"duration":3,"state":"Goa"}'


Or use Postman to send a POST request to:

http://localhost:4000/api/plan


Response should contain:

itinerary

places

transport

coords

7️⃣ Connect frontend

Replace API URL in frontend fetch/axios calls:

const API_URL = "http://localhost:4000/api/plan";
