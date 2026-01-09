import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  const sql = neon(process.env.DATABASE_URL);

  if (request.method === 'GET') {
    try {
      // Return last 50 visitors
      const visitors = await sql`SELECT * FROM Visitors ORDER BY visited_at DESC LIMIT 50`;
      return response.status(200).json(visitors);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  if (request.method === 'POST') {
    try {
      const forwarded = request.headers['x-forwarded-for'];
      const ip = forwarded ? forwarded.split(',')[0] : (request.socket.remoteAddress || 'Unknown');
      const userAgent = request.headers['user-agent'] || 'Unknown';

      await sql`INSERT INTO Visitors (ip_address, user_agent) VALUES (${ip}, ${userAgent})`;
      return response.status(201).json({ message: 'Visitor logged', ip });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
