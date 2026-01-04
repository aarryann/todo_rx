import fs from 'node:fs/promises';
import path from 'node:path';

export async function getToDos() {
  const p = path.resolve('src/data/todos.json');
  const raw = await fs.readFile(p, 'utf8');
  return JSON.parse(raw);
}

export default { getToDos };
