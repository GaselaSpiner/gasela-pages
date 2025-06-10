import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.https://lmussgaiutaldicolyba.supabase.co,
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdXNzZ2FpdXRhbGRpY29seWJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgxNTAwNCwiZXhwIjoyMDY0MzkxMDA0fQ.9s1aR4nocxWRvP91e3TiUylZsSji93iAdEjWQ38taSQ
);

export default async function handler(req, res) {
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
      console.error('🔴 Supabase error:', error);
      return res.status(500).json({ error: error.message || 'Błąd zapisu' });
    }

    return res.status(200).json({ message: 'Plan zapisany pomyślnie' });

  } catch (err) {
    console.error('🔴 Nieoczekiwany wyjątek:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
