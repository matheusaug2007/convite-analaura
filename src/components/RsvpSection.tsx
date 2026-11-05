import { FormEvent, useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Gift, Loader2 } from 'lucide-react';
import { submitRsvp } from '../lib/supabase';
import { PHONE_ERROR, formatPhone, isValidPhone } from '../lib/phone';
import type { RsvpStatus } from '../types';
import Stepper from './Stepper';

function fireConfetti() {
  const colors = ['#D39878', '#E8A598', '#A599B5', '#8EA08A', '#FFFFFF'];
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 }, colors });
  setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.8 }, colors }), 250);
  setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.8 }, colors }), 400);
}

export default function RsvpSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [status, setStatus] = useState<RsvpStatus>('confirmed');
  const [companions, setCompanions] = useState(0);
  const [companionNames, setCompanionNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<RsvpStatus | null>(null);
  const [error, setError] = useState('');

  const changeCompanions = (n: number) => {
    const v = Math.min(10, Math.max(0, n));
    setCompanions(v);
    setCompanionNames((prev) => Array.from({ length: v }, (_, i) => prev[i] ?? ''));
  };

  const phoneInvalid = phoneTouched && !isValidPhone(phone);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidPhone(phone)) {
      setPhoneTouched(true);
      return;
    }
    const going = status === 'confirmed';
    // Com acompanhantes, todos os nomes são obrigatórios (espaços em branco não valem)
    if (going && companionNames.some((n) => n.trim().length < 2)) {
      setError(
        companions === 1
          ? 'Informe o nome do seu acompanhante.'
          : 'Informe o nome de todos os seus acompanhantes.',
      );
      return;
    }
    setLoading(true);
    try {
      await submitRsvp({
        guest_name: name.trim(),
        phone: phone.trim(),
        status,
        number_of_companions: going ? companions : 0,
        companion_names: going ? companionNames.map((n) => n.trim()).filter(Boolean) : [],
      });
      setDone(status);
      if (going) fireConfetti();
    } catch {
      setError('Não foi possível enviar agora. Tente novamente em instantes. 💛');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="relative z-10 px-6 py-16">
      <h2 className="section-title">Confirme sua presença</h2>
      <div className="glass mx-auto mt-8 max-w-md p-6">
        {done ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-salvia text-white">
              <Check size={32} />
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-nude">
              {done === 'confirmed' ? 'Presença confirmada!' : 'Obrigada por avisar!'}
            </h3>
            <p className="mt-2 text-sm font-light text-legenda">
              {done === 'confirmed'
                ? 'Mal posso esperar para celebrar com você! 🌸'
                : 'Sentiremos sua falta, mas agradecemos o carinho. 💛'}
            </p>
            {done === 'confirmed' && (
              <a href="#presentes" className="btn-outline mt-5 !text-xs">
                <Gift size={14} /> Quer saber o que a Ana Laura gosta?
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input className="input" required placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
            <div>
              <input
                className={`input ${phoneInvalid ? '!border-rosa focus:!ring-rosa/30' : ''}`}
                required
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={15}
                placeholder="(44) 99999-9999"
                aria-invalid={phoneInvalid}
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                onBlur={() => setPhoneTouched(true)}
              />
              {phoneInvalid && <p className="mt-1.5 px-2 text-xs text-[#B25E52]">{PHONE_ERROR}</p>}
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-tinta">Vai comparecer?</p>
              <div className="grid grid-cols-2 gap-3">
                {(['confirmed', 'declined'] as RsvpStatus[]).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStatus(s)}
                    style={status === s ? { backgroundColor: 'var(--button-color)', borderColor: 'var(--button-color)' } : undefined}
                    className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
                      status === s ? 'text-white' : 'border-terracota/40 text-nude'
                    }`}
                  >
                    {s === 'confirmed' ? 'Sim, vou!' : 'Não poderei'}
                  </button>
                ))}
              </div>
            </div>

            {status === 'confirmed' && (
              <>
                <div>
                  <p className="mb-2 text-sm font-medium text-tinta">Quantos acompanhantes?</p>
                  <Stepper value={companions} min={0} max={10} onChange={changeCompanions} />
                </div>
                {companionNames.map((n, i) => (
                  <input
                    key={i}
                    className="input"
                    required
                    placeholder={`Nome do acompanhante ${i + 1}`}
                    value={n}
                    onChange={(e) => setCompanionNames((prev) => prev.map((p, idx) => (idx === i ? e.target.value : p)))}
                  />
                ))}
              </>
            )}

            {error && <p className="text-center text-sm text-[#B25E52]">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Enviar resposta'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

