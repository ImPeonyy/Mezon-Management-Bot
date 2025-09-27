// src/server.ts
import app from "./app";


const PORT = process.env.PORT || 3000;

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running`);
    });
  } catch (err) {
    console.error("🚨 Cannot start server:", err);
    process.exit(1);
  }
}

start();
