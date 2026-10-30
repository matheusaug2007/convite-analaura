# Especificação de Frontend & Prompts para o Antigravity

## 1. Stack Tecnológica Recomendada
- **Framework:** React ou HTML5/TailwindCSS standalone.
- **Estilização:** Tailwind CSS (cores personalizadas conforme o arquivo `01_PROJECT_OVERVIEW_AND_DESIGN.md`).
- **Animações:** Framer Motion ou Lucide Icons + CSS Animations / Canvas Confetti para a celebração pós-RSVP.
- **Tipografia:** Google Font `Poppins` (pesos 300, 400, 500, 600, 700).

---

## 2. Estrutura de Seções da Página (Mobile-First)

1. **Cover / Interstitial:**
   - Envelope virtual ou monograma interativo com animação de desdobramento floral.
2. **Hero Section:**
   - Número **15** com sombra suave e texturizado.
   - Nome: **Ana Laura Martins**.
   - Subtítulo: *"Venha comemorar comigo esse momento inesquecível"*.
3. **Data & Contagem Regressiva:**
   - 26 de Dezembro de 2026 às 19h00.
   - Cards com contador dinâmico (Dias / Horas / Minutos / Segundos).
4. **Localização & Mapa:**
   - **Crystal Eventos**, Mandaguari - PR.
   - Botões de ação direta: "Abrir no Google Maps" e "Abrir no Waze".
5. **Formulário de Confirmação (RSVP):**
   - Nome completo.
   - Telefone / WhatsApp.
   - Vai comparecer? (Sim / Não).
   - Quantos acompanhantes levará (com campo dinâmico para os nomes).
   - Botão de envio com feedback visual (confetes na tela ao confirmar com sucesso).
6. **Mural de Carinho (Recados):**
   - Feed com mensagens enviadas por amigos e familiares.
   - Campo para deixar uma mensagem fofa para a debutante.
7. **Footer / Créditos:**
   - Frase carinhosa da debutante e botão de compartilhamento no WhatsApp.

---

## 3. Prompt Pronto para Copiar e Colar no Antigravity

Copie o texto delimitado abaixo e use diretamente como instrução de desenvolvimento:

```text
Você é um desenvolvedor frontend especialista em UI/UX mobile-first e interfaces imersivas para eventos sociais de alto padrão.
Preciso construir o site do convite interativo de 15 anos para "Ana Laura Martins".

Siga rigorosamente as diretrizes abaixo:
1. DESIGN & ESTÉTICA:
- Fundo em off-white quente (#FAF6F0) com bordas e ilustrações botânicas aquareladas (rosas, hortênsias/lavanda e folhagens suaves).
- Tipografia obrigatória: Google Font 'Poppins' em toda a aplicação.
- Tons de destaque em terracota suave (#D39878), nude rosado e verde sálvia.
- Efeito Glassmorphism suave nos cards e modais para transmitir leveza e sofisticação.

2. DADOS DO EVENTO:
- Nome: Ana Laura Martins (15 Anos)
- Data: Sábado, 26 de Dezembro de 2026 às 19h00
- Local: Crystal Eventos - Mandaguari - PR

3. FUNCIONALIDADES:
- Efeito de abertura elegante ao entrar na página (botão ou gesto de deslizar para abrir o convite).
- Contagem regressiva em tempo real até 26/12/2026 19:00:00.
- Seção de Localização com link direto para rota do Google Maps e Waze.
- Formulário de Confirmação de Presença (RSVP) integrado com Supabase (campos: Nome, WhatsApp, Confirmação Sim/Não, Acompanhantes).
- Efeito de confetes festivos com 'canvas-confetti' ao submeter a presença.
- Mural interativo para os convidados deixarem recados e felicitações.

Gere o código limpo, componentizado, 100% responsivo para smartphone e pronto para deploy no Netlify.
```