exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { id } = JSON.parse(event.body);
    if (!id) {
      return { statusCode: 400, body: 'No id provided' };
    }

    // First get current upvotes
    const getRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/questions?id=eq.${id}&select=upvotes`,
      {
        headers: {
          'apikey': process.env.SUPABASE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
        }
      }
    );

    const rows = await getRes.json();
    if (!rows || rows.length === 0) {
      return { statusCode: 404, body: 'Question not found' };
    }

    const newCount = (rows[0].upvotes || 0) + 1;

    // Update upvotes
    const updateRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/questions?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ upvotes: newCount })
      }
    );

    if (!updateRes.ok) {
      return { statusCode: 500, body: 'Failed to update upvotes' };
    }

    return { statusCode: 200, body: JSON.stringify({ upvotes: newCount }) };

  } catch (err) {
    return { statusCode: 500, body: 'Server error' };
  }
};
