import { Pool } from "pg";
import envVars from "./config.dotenv.js";

export class Database {
  static #instance;
  #pool;

  constructor() {
    // Prevent accidental double-instantiation if someone uses `new Database()`
    if (Database.#instance) {
      return Database.#instance;
    }

    this.#pool = new Pool({
      host: envVars.DB_HOST,
      user: envVars.DB_USER,
      password: envVars.DB_PASSWORD,
      database: envVars.DB_NAME,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    Database.#instance = this;
  }

  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }

  /**
   * Standard query execution.
   * If a transaction client is passed, it uses that client. Otherwise, it uses the pool.
   */
  async query(text, params, client = null) {
    if (client) {
      return client.query(text, params);
    }
    return this.#pool.query(text, params);
  }

  /**
   * Safe transaction wrapper.
   * Automatically handles BEGIN, COMMIT, ROLLBACK, and releasing the client.
   */
  async transaction(callback) {
    const client = await this.#pool.connect();
    
    try {
      await client.query("BEGIN");
      
      // Execute the callback containing your queries
      const result = await callback(client);
      
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error; // Re-throw the error so the calling function knows it failed
    } finally {
      // Always release the client back to the pool, even on error
      client.release();
    }
  }
}