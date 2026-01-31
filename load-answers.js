import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    // Get the key for this student's chapter answers
    const key = `chapter:enslaved-africans:${studentId.toLowerCase().trim()}`;

    // Retrieve the data
    const data = await kv.get(key);

    if (!data) {
      return res.status(200).json({ 
        success: true,
        found: false,
        message: 'No previous answers found'
      });
    }

    return res.status(200).json({ 
      success: true,
      found: true,
      data
    });

  } catch (error) {
    console.error('Error loading answers:', error);
    return res.status(500).json({ 
      error: 'Failed to load answers',
      details: error.message 
    });
  }
}
