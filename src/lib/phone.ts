/** Máscara de telefone brasileiro: (44) 99999-9999 (celular) ou (44) 9999-9999 (fixo). */
export function formatPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/**
 * Valida telefone brasileiro com DDD:
 * - 11 dígitos (celular): o 3º dígito precisa ser 9
 * - 10 dígitos (fixo): o 3º dígito vai de 2 a 5
 * - DDD de 11 a 99, sem zero
 * - rejeita sequências repetidas (ex.: 11111111111)
 */
export function isValidPhone(value: string): boolean {
  const d = value.replace(/\D/g, '');
  if (d.length !== 10 && d.length !== 11) return false;
  if (/^(\d)\1+$/.test(d)) return false;
  if (!/^[1-9][1-9]$/.test(d.slice(0, 2))) return false;
  if (d.length === 11) return d[2] === '9';
  return d[2] >= '2' && d[2] <= '5';
}

export const PHONE_ERROR = 'Informe um telefone válido com DDD, ex.: (44) 99999-9999';
