import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  const sql = neon(process.env.DATABASE_URL);

  if (request.method === 'GET') {
    try {
      const messages = await sql`SELECT * FROM Guestbook ORDER BY created_at DESC`;
      return response.status(200).json(messages);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  if (request.method === 'POST') {
    try {
      const { nickname, content } = request.body;
      if (!nickname || !content) {
        return response.status(400).json({ error: 'Name and content are required' });
      }
      await sql`INSERT INTO Guestbook (nickname, content) VALUES (${nickname}, ${content})`;
      return response.status(201).json({ message: 'Message posted' });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  // DELETE endpoint (optional)
  if (request.method === 'DELETE') {
     const { id } = request.query;
     if (!id) return response.status(400).json({ error: 'ID required' });
     await sql`DELETE FROM Guestbook WHERE id = ${id}`;
     return response.status(200).json({ message: 'Deleted' });
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
