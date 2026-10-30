# Projeto: Convite Interativo 15 Anos - Ana Laura Martins

## 1. Visão Geral
Aplicação web mobile-first interativa e imersiva para o aniversário de 15 anos de Ana Laura Martins. O site substituirá o PDF tradicional, oferecendo uma experiência sensorial com animações suaves, contagem regressiva, confirmação de presença (RSVP), mapa do local e mural de recados.

---

## 2. Dados do Evento
- **Aniversariante:** Ana Laura Martins
- **Ocasião:** 15 Anos
- **Data:** 26 de Dezembro de 2026 (Sábado)
- **Horário:** 19:00h
- **Local:** Crystal Eventos — Mandaguari - PR
- **Dress Code Sugerido:** Esporte Fino / Traje de Gala (opcional para o cliente definir)

---

## 3. Identidade Visual (Baseada na Arte Original)
A identidade estética é **Floral Aquarela Botânica / Vintage Romântico**.

### Paleta de Cores (CSS Tokens)
- **Fundo Primário (Papel/Linho Artesanal):** `#FAF6F0` (Off-white levemente aquecido)
- **Fundo Secundário (Cartão/Cards):** `#FFFFFF` / `rgba(255, 255, 255, 0.85)` com blur (*Glassmorphism*)
- **Tom Principal de Destaque (Terracota Pastel / Pêssego Dourado):** `#D39878`
- **Tom Secundário (Nude Queimado):** `#B37B5C`
- **Rosa Botânico (Pétalas):** `#E8A598`
- **Lilás / Lavanda Floral:** `#A599B5`
- **Verde Sálvia Suave (Folhagens):** `#8EA08A`
- **Texto Principal (Contraste Suave):** `#3E3835` (Evitar preto puro `#000`)
- **Texto Secundário / Legendas:** `#7B736E`

---

## 4. Tipografia
- **Família Principal:** `Poppins`, sans-serif (Google Fonts).
  - Pesos recomendados: 
    - `300` (Light) para textos explicativos e detalhes.
    - `400` (Regular) para corpo de texto e inputs.
    - `600` (Semi-bold) e `700` (Bold) para títulos, numerais e destaque.
- **Tipografia de Apoio Opcional (apenas para números ou detalhes finos estilo editorial):** `Playfair Display` ou `Cinzel` caso queira manter a elegância do número `15` original.

---

## 5. Experiência do Usuário (Microinterações & Animações)
1. **Abertura em Estilo Envelope / Cortina (Hero):**
   - Ao carregar a página no celular, o usuário vê um selo/monograma com o número "15".
   - Botão interativo: *"Tocar para abrir o convite"*.
   - Ao tocar, há um efeito suave de abertura (desenrolar floral com pétalas caindo ou borboletas voando suavemente).
2. **Flores e Folhagens Flutuantes (Parallax Suave):**
   - Elementos em SVG botânicos nos cantos superiores e inferiores, movendo-se suavemente ao rolar a página.
3. **Contagem Regressiva Interativa (Countdown):**
   - Dias, Horas, Minutos e Segundos até o dia 26/12/2026 às 19:00.
4. **Módulos de Ação Rápida:**
   - Botão para "Confirmar Presença" (leva direto ao modal/form).
   - Botão para "Como Chegar" (abre rota no Waze e Google Maps).
   - Botão para "Adicionar à Agenda" (Google Calendar / Apple Calendar).