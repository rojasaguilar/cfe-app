import envVars from "./src/config/config.dotenv.js"; // Ajusta la ruta a tu archivo de variables
import app from "./src/app.js";
import { Database } from "./src/config/Database.js"; // Ajusta la ruta a tu Singleton de BD

// 1. Manejo de excepciones síncronas no atrapadas
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Apagando servidor...");
  console.error(err.name, err.message);
  process.exit(1);
});

// 2. Probar conexión a la Base de Datos al arrancar
const testDbConnection = async () => {
  try {
    const db = Database.getInstance();
    await db.query("SELECT 1"); // Una consulta muy ligera solo para comprobar la conexión
    console.log("✅ Conexión a la base de datos PostgreSQL exitosa.");
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error.message);
  }
};
testDbConnection();

// 3. Iniciar el servidor
const PORT = envVars.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}...`);
  console.log(`🌍 Entorno de ejecución: ${envVars.NODE_ENV || "desarrollo"}`);
});

// 4. Manejo de promesas asíncronas rechazadas y no atrapadas (ej. caídas de BD)
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Apagando servidor de forma segura...");
  console.error(err.name, err.message);
  // Cerramos el servidor HTTP primero para no cortar peticiones a medias
  server.close(() => {
    process.exit(1);
  });
});
