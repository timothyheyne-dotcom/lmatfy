exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { question } = JSON.parse(event.body);
    if (!question || question.trim().length === 0) {
      return { statusCode: 400, body: 'No question provided' };
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/questions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          question: question.trim(),
          approved: false,
          upvotes: 0
        })
      }
    );

    if (!response.ok) {
      return { statusCode: 500, body: 'Failed to save question' };
    }

    return { statusCode: 200, body: 'OK' };

  } catch (err) {
    return { statusCode: 500, body: 'Server error' };
  }
};
