// src/server.ts
import app from "./app";


const PORT = parseInt(process.env.PORT || '3000', 10);

async function start() {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("🚨 Cannot start server:", err);
    process.exit(1);
  }
}

start();
