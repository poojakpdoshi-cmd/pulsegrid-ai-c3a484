import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(request, response) {
  if (request.method === 'GET') {
    const { data, error } = await supabase.from('items').select('*').order('created_at', { ascending: false });
    if (error) return response.status(500).json({ error: error.message });
    return response.status(200).json({ items: data });
  }

  if (request.method === 'POST') {
    const payload = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const name = String(payload?.name || '').trim();
    if (name.length < 2) return response.status(400).json({ error: 'A valid name is required.' });
    const { data, error } = await supabase.from('items').insert({ name }).select().single();
    if (error) return response.status(500).json({ error: error.message });
    return response.status(201).json({ item: data });
  }

  return response.status(405).json({ error: 'Method not allowed.' });
}
