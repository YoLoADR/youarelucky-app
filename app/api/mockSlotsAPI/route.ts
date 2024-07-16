import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'src/utils/mockSlots.json');
    console.log(`Reading mockData from: ${filePath}`); // Log the path for debugging
    const fileContents = await fs.readFile(filePath, 'utf8');
    const mockData = JSON.parse(fileContents);
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error reading mockData.json:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
