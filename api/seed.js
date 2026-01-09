import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // 创建博客表
    const result = await sql`
      CREATE TABLE IF NOT EXISTS Blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        emoji VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return response.status(200).json({ message: "Table created successfully", result });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}