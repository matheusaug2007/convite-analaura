import { FormEvent, useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { fetchMessages, isSupabaseConfigured, submitMessage } from '../lib/supabase';
import type { GuestbookMessage } from '../types';

export default function GuestbookSection() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const load = () => fetchMessages().then(setMessages).catch(() => setError('Não foi possível carregar os recados.'));

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await submitMessage(author.trim(), text.trim());
      setAuthor('');
      setText('');
      setSent(true);
      setTimeout(() => setSent(false), 4000);
      await load();
    } catch {
      setError('Não foi possível enviar seu recado agora. Tente novamente. 💛');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="mural" className="relative z-10 px-6 py-16">
      <h2 className="section-title">Mural de carinho</h2>
      <p className="mt-2 text-center text-sm font-light text-legenda">Deixe uma mensagem para a Ana Laura</p>

      <form onSubmit={onSubmit} className="glass mx-auto mt-8 max-w-md space-y-3 p-6">
        <input className="input" required maxLength={60} placeholder="Seu nome" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <textarea
          className="input min-h-28 resize-none"
          required
          maxLength={500}
          placeholder="Escreva sua mensagem fofa..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {error && <p className="text-center text-sm text-rosa">{error}</p>}
        {sent && <p className="text-center text-sm text-salvia">Recado enviado com carinho! 🌸</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <><Heart size={16} /> Enviar recado</>}
        </button>
        {!isSupabaseConfigured && (
          <p className="text-center text-[11px] font-light text-legenda">
            Modo demonstração: recados salvos apenas neste navegador.
          </p>
        )}
      </form>

      <ul className="mx-auto mt-8 max-w-md space-y-3">
        {messages.length === 0 && (
          <li className="text-center text-sm font-light text-legenda">Seja o primeiro a deixar um recado! 💌</li>
        )}
        {messages.map((m) => (
          <li key={m.id} className="glass p-4">
            <p className="text-sm font-light text-tinta">{m.message}</p>
            <p className="mt-2 text-xs font-semibold text-terracota">— {m.author_name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

