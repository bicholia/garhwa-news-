const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const names = data.models ? data.models.map(m => m.name) : ["No models found"];
    fs.writeFileSync('scripts/models.json', JSON.stringify(names, null, 2));
    console.log("Wrote to models.json");
  } catch (e) {
    console.error("Error:", e);
  }
}

listModels();
