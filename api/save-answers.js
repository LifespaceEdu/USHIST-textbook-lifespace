import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentId, answers, completed = false } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    // Create the key for this student's chapter answers
    const key = `chapter:enslaved-africans:${studentId.toLowerCase().trim()}`;

    // Store the data
    const data = {
      studentId,
      answers,
      completed,
      lastSaved: new Date().toISOString(),
      chapter: 'enslaved-africans'
    };

    await kv.set(key, data);

    return res.status(200).json({ 
      success: true, 
      message: 'Answers saved successfully',
      lastSaved: data.lastSaved
    });

  } catch (error) {
    console.error('Error saving answers:', error);
    return res.status(500).json({ 
      error: 'Failed to save answers',
      details: error.message 
    });
  }
}
