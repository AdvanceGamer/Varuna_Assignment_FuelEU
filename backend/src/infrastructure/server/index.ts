import 'dotenv/config';
import { buildApp } from './app.js';

const PORT = Number(process.env.PORT || 3001);

async function main() {
  const app = buildApp();
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`API running on http://localhost:${PORT}`);
}

main();
