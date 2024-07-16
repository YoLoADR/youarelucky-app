import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'src/utils/mockPatients.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const mockPatients = JSON.parse(fileContents);
  res.status(200).json(mockPatients);
}
