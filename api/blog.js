import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // GET: 获取所有博客
    if (request.method === 'GET') {
      const rows = await sql`SELECT * FROM Blogs ORDER BY created_at DESC;`;
      return response.status(200).json(rows);
    } 
    
    // POST: 发布新博客
    else if (request.method === 'POST') {
      const { title, content, emoji } = request.body;
      if (!title || !content) {
        return response.status(400).json({ error: 'Title and content are required' });
      }
      
      await sql`INSERT INTO Blogs (title, content, emoji) VALUES (${title}, ${content}, ${emoji});`;
      return response.status(200).json({ message: 'Blog created' });
    } 
    
    // DELETE: 删除博客
    else if (request.method === 'DELETE') {
      const { id } = request.query;
      if (!id) {
        return response.status(400).json({ error: 'ID is required' });
      }
      
      await sql`DELETE FROM Blogs WHERE id = ${id};`;
      return response.status(200).json({ message: 'Blog deleted' });
    }

    else {
        return response.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
}