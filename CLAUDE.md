# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Landing page gerada por um sistema multi-agente. A stack final é **HTML/CSS/JS puro** (sem frameworks).

---

## Design System

Este projeto adota o **Material Design 3 (M3)** como padrão visual e de componentes.

### Diretrizes obrigatórias

- **Cores:** usar o sistema de color tokens do M3 (Primary, Secondary, Tertiary, Surface, On-*, etc.). Gerar paleta via [Material Theme Builder](https://m3.material.io/theme-builder).
- **Tipografia:** escala tipográfica do M3 (Display, Headline, Title, Body, Label) com a fonte **Roboto** ou outra Google Font compatível.
- **Elevação:** usar sombras e surface tones conforme os níveis de elevação do M3 (nível 0 a 5).
- **Componentes:** seguir as especificações de shape, state layers (hover, focus, pressed) e motion do M3.
- **Espaçamento:** grid de 4dp e margens de 16dp/24dp conforme M3.
- **Bordas:** border-radius conforme shape scale do M3 (Extra Small 4px, Small 8px, Medium 12px, Large 16px, Extra Large 28px, Full).
- **Botões:** usar os estilos do M3 (Filled, Tonal, Outlined, Text, Elevated) conforme hierarquia de ação.
- **Ícones:** usar Material Symbols (variante Outlined ou Rounded) via Google Fonts.

### Referência

- Especificação oficial: https://m3.material.io/

---

## Agentes

Este projeto usa um pipeline de agentes especializados. Cada agente tem um papel bem definido e recebe o contexto dos agentes anteriores.

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