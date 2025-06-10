const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda niedozwolona' });
  }

  const { email, plan } = req.body;

  if (!email || !plan) {
    return res.status(400).json({ error: 'Brak emaila lub planu' });
  }

  try {
    const { error } = await supabase.from('pending_plans').upsert(
      {
        email,
        plan_name: plan,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({ error: error.message || 'Błąd zapisu' });
    }

    return res.status(200).json({ message: 'Plan zapisany pomyślnie' });

  } catch (err) {
    console.error('❌ Nieoczekiwany wyjątek:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
