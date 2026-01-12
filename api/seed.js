import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // 创建博客表
    await sql`
      CREATE TABLE IF NOT EXISTS Blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        emoji VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // 创建留言板表 (Guestbook)
    await sql`
      CREATE TABLE IF NOT EXISTS Guestbook (
        id SERIAL PRIMARY KEY,
        nickname VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 创建访客记录表 (Visitors)
    await sql`
      CREATE TABLE IF NOT EXISTS Visitors (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(50) NOT NULL,
        user_agent TEXT,
        country VARCHAR(100),
        city VARCHAR(100),
        visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Migration helper: Add columns if they don't exist (for existing tables)
    try {
        await sql`ALTER TABLE Visitors ADD COLUMN IF NOT EXISTS country VARCHAR(100)`;
        await sql`ALTER TABLE Visitors ADD COLUMN IF NOT EXISTS city VARCHAR(100)`;
    } catch (e) {
        console.log("Migration note: Columns may already exist or another error occurred during migration check.");
    }

    return response.status(200).json({ message: "All tables created successfully" });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}