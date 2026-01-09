import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    // 创建博客表
    // id: 自增主键
    // title: 标题
    // content: 内容
    // emoji: 表情符号
    // created_at: 创建时间，默认为当前时间
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