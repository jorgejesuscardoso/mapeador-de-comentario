import { Client } from 'pg';

const client = new Client({
  connectionString: "postgresql://db_lunar_user:KZ0BopvimZzKti5pqKMDyGzJa6UEP08q@dpg-cuiih356l47c73afonog-a.oregon-postgres.render.com/db_lunar",
  ssl: { rejectUnauthorized: false }
});

const connectToDatabase = async (): Promise<void> => {
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL!');
  } catch (err) {
    console.error('❌ Erro ao conectar:', err);
  }
};

connectToDatabase();
