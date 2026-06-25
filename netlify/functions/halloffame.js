exports.handler = async (event) => {
  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/questions?approved=eq.true&order=upvotes.desc&limit=3`,
      {
        headers: {
          'apikey': process.env.SUPABASE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
        }
      }
    );

    const data = await res.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
