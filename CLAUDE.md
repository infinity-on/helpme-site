# CLAUDE.md

Este arquivo orienta o Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## Projeto

Landing page gerada por um sistema multi-agente. A stack final é **HTML/CSS/JS puro** (sem frameworks).

---

## Design System

Base visual: **Material Design 3 (M3)**, tema **light**, neutros na escala **Slate**.

> **Fonte de verdade: `../DESIGN_TOKENS.md` (raiz da plataforma).** Cores,
> tipografia, shape e espaçamento vivem lá — não inventar paleta nem gerar tokens
> aqui (ex.: **não** usar o Material Theme Builder para criar uma paleta nova). O
> arquivo `css/tokens.css` é a **implementação de referência em CSS**: espelha os
> valores de `DESIGN_TOKENS.md`, não os define. Ao mudar um token, altere no
> `DESIGN_TOKENS.md` primeiro e propague para os três projetos (`clientapp`,
> `providerapp`, `helpme-site`) na mesma tarefa. Se `tokens.css` divergir da fonte,
> trate como **bug de consistência** e alinhe à fonte.

### Diretrizes

- **Cores:** consumir as CSS vars `--md-sys-color-*` definidas em `css/tokens.css`
  (que espelham `DESIGN_TOKENS.md`). Nunca hardcodar hex nas seções/componentes.
- **Tipografia:** **Poppins** (Google Fonts, pesos 300–700), alinhada aos apps
  Flutter; escala tipográfica do M3 (Display, Headline, Title, Body, Label).
- **Elevação:** usar os tokens `--md-sys-elevation-level*` de `tokens.css`.
- **Componentes:** seguir shape, state layers (hover, focus, pressed) e motion do M3.
- **Espaçamento:** grid de 4dp e margens de 16dp/24dp conforme M3.
- **Bordas:** usar os tokens `--md-sys-shape-corner-*` (Extra Small 4px, Small 8px,
  Medium 12px, Large 16px, Extra Large 28px, Full).
- **Botões:** estilos do M3 (Filled, Tonal, Outlined, Text, Elevated) conforme
  hierarquia de ação.
- **Ícones:** **Material Symbols Rounded** via Google Fonts.

### Referência

- Tokens da plataforma: `../DESIGN_TOKENS.md` · espelho CSS: `css/tokens.css`
- Especificação M3: https://m3.material.io/

---

## Agentes

Este projeto usa um pipeline de agentes especializados. Cada agente tem um papel bem definido e recebe o contexto dos agentes anteriores.

> **Os agentes não são validação independente.** São *personas no mesmo contexto*
> (templates de prompt), não subagentes isolados nem pessoas. Um "QA aprovou" é o
> mesmo modelo encenando um checklist — não prova que a página funciona. Validação
> de verdade = abrir a página e conferir responsividade (mobile 320px+ / tablet
> 768px+ / desktop 1200px+), CTAs visíveis e console sem erro. Para uma segunda
> opinião realmente independente, usar um subagente isolado (Task).

### Fluxo padrão

```
[UX/UI Designer] → Arquiteto/Planner → Arquiteto de Código → Copywriter
                                                                    ↓
                                        QA ← SEO ← Integrador de Assets ← Designer de Componentes
```

---

### 1. Arquiteto / Planner
**Quando acionar:** Início de qualquer nova landing page ou redesign estrutural.

**Responsabilidade:**
- Definir quais seções a página terá e em qual ordem
- Escolher paleta de cores coerente com o tom e produto
- Definir tipografia (Google Fonts)
- Estabelecer os objetivos de conversão

**Recebe:** briefing do produto (nome, descrição, público, objetivo, tom, preferências visuais)
**Entrega:** plano com seções, paleta de cores, tipografia e objetivos

---

### 2. Arquiteto de Código
**Quando acionar:** Após o Planner, antes de qualquer código ser escrito.

**Responsabilidade:**
- Definir estrutura de arquivos do projeto
- Estabelecer estratégia de CSS (variáveis custom, nomenclatura de classes, organização)
- Listar os componentes HTML que serão criados
- Definir convenções que todos os agentes devem seguir

**Recebe:** plano do Arquiteto/Planner
**Entrega:** estrutura de arquivos, convenções de código, lista de componentes

---

### 3. Copywriter / Conteúdo
**Quando acionar:** Após o Planner definir as seções.

**Responsabilidade:**
- Escrever headline, subtítulo e CTAs do hero
- Escrever textos de cada seção definida no plano
- Adaptar tom ao público-alvo
- Copy orientado a conversão (benefício > feature)

**Recebe:** briefing + plano do Arquiteto
**Entrega:** todos os textos da página organizados por seção

---

### 4. Designer de Componentes
**Quando acionar:** Após Arquiteto de Código e Copywriter estarem prontos.

**Responsabilidade:**
- Gerar o HTML semântico completo
- Escrever o CSS com variáveis, responsividade e animações
- Implementar JavaScript vanilla para interações
- Seguir estritamente a arquitetura e convenções definidas

**Recebe:** plano + arquitetura + copy
**Entrega:** `index.html`, `style.css`, `main.js` completos e funcionais

---

### 5. Integrador de Assets
**Quando acionar:** Após o Designer de Componentes gerar o código base.

**Responsabilidade:**
- Adicionar ícones SVG inline onde apropriado
- Criar elementos decorativos SVG (formas, separadores de seção)
- Substituir placeholders por SVGs ilustrativos
- Garantir acessibilidade dos assets (aria-label, aria-hidden)

**Recebe:** HTML/CSS gerado pelo Designer de Componentes
**Entrega:** HTML/CSS atualizado com assets integrados

---

### 6. SEO / Meta
**Quando acionar:** Após o código estar visualmente pronto (pós-assets).

**Responsabilidade:**
- Inserir e otimizar meta tags (title, description, Open Graph, Twitter Card)
- Adicionar schema.org JSON-LD
- Garantir acessibilidade: aria-labels, roles, alt texts
- Otimizar headings (h1 único, hierarquia correta)
- Adicionar preconnect/preload para performance

**Recebe:** HTML final + copy (para extrair meta description)
**Entrega:** HTML com SEO e acessibilidade completos

---

### 7. QA / Revisor
**Quando acionar:** Último agente do pipeline, antes de entregar o resultado final.

**Responsabilidade:**
- Verificar responsividade: mobile (320px+), tablet (768px+), desktop (1200px+)
- Checar consistência visual com a paleta definida
- Identificar e corrigir bugs de CSS e JavaScript
- Validar que todos os CTAs estão visíveis e funcionais
- Produzir relatório das correções aplicadas

**Recebe:** HTML/CSS/JS completos + plano original (para validar paleta e seções)
**Entrega:** código corrigido + relatório de QA

---

### 8. UX/UI Designer *(acionado apenas quando solicitado)*
**Quando acionar:** Somente quando o usuário pedir explicitamente. Roda **antes** do Arquiteto/Planner.

**Responsabilidade:**
- Definir wireframe conceitual (descrição textual do layout de cada seção)
- Mapear o fluxo do usuário na página (scroll journey)
- Identificar pontos de conversão e micro-interações
- Definir hierarquia visual e de informações
- Recomendar padrões de UX para o objetivo do produto

**Recebe:** briefing do produto
**Entrega:** blueprint de UX que o Arquiteto/Planner deve seguir

---

## Assets disponíveis

- `assets/proprietary/helpme_logomark.svg` — logomarca, usar no header, footer e favicon
- `assets/proprietary/helpme_logomark.ico` — favicon ICO
- `assets/images/og-image.png` — imagem Open Graph (1200×630)
- `assets/third-party/unDraw/` — ilustrações SVG

## Output esperado

Os arquivos gerados devem ser salvos seguindo a estrutura do projeto:
- `index.html` — markup da página
- `css/tokens.css` — design tokens (variáveis CSS)
- `css/base.css` — reset, tipografia, animações, utilitários globais
- `css/components.css` — botões, cards, chips e outros componentes reutilizáveis
- `css/sections.css` — header, hero, seções de conteúdo e footer
- `js/main.js` — JavaScript vanilla

## Quando não souber (antialucinação)

- Token visual (cor, tipografia, shape) que não está no `../DESIGN_TOKENS.md` /
  `css/tokens.css`: **não invente** nem gere paleta nova — consulte a fonte. Texto
  de UI é em **pt-br**.
- Não afirmar que a página "funciona", "é responsiva" ou "está sem erro" sem ter
  aberto e verificado nesta sessão. Dizer o que foi conferido e o que não foi.
- Ao citar arquivo, classe CSS ou seção, confirmar que existe antes de recomendar
  — não derivar de memória.