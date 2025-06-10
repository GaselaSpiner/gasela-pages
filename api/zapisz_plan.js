const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, plan } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ error: 'Brakuje emaila lub planu' });
    }

    const { error } = await supabase
      .from('pending_plans')
      .upsert({ email, plan }, { onConflict: 'email' });

    if (error) {
      console.error('❌ Błąd Supabase:', error);
      return res.status(500).json({ error: 'Błąd zapisu do bazy danych' });
    }

    return res.status(200).json({ message: '✅ Plan zapisany poprawnie' });
  } catch (err) {
    console.error('❌ Błąd serwera:', err);
    return res.status(500).json({ error: 'Błąd serwera' });
  }
};
