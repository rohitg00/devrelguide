import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

export async function readJsonData<T = unknown>(filename: string): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, filename)
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content) as T
  } catch {
    return [] as unknown as T
  }
}

export async function writeJsonData(filename: string, data: unknown): Promise<void> {
  const filePath = path.join(DATA_DIR, filename)
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}
