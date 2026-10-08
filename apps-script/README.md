# Lista de espera → Google Sheets

Os formulários de lista de espera (`js/main.js`) enviam cada cadastro para um
Web App do Google Apps Script, que grava uma linha numa planilha. Sem servidor
próprio: o site continua estático no GitHub Pages.

Enquanto `WAITLIST_ENDPOINT` estiver vazio em `js/main.js`, o site cai no
`mailto:` para `contato@helpme.technology` — nada se perde, mas depende de o
visitante enviar o e-mail.

## Instalação (≈5 min, uma vez)

1. Crie uma planilha no Google Drive da conta da helpme (ex.: "helpme — lista de espera").
2. Na planilha: **Extensões → Apps Script**.
3. Apague o conteúdo de `Code.gs` e cole o de [`waitlist.gs`](./waitlist.gs). Salve.
4. **Implantar → Nova implantação** → tipo **App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Autorize o acesso à planilha quando o Google pedir.
6. Copie a **URL do app da Web** (termina em `/exec`).
7. Abra essa URL no navegador: deve aparecer `{"ok":true,"service":"helpme-waitlist"}`.
8. Cole a URL em `WAITLIST_ENDPOINT`, no topo da seção "Lista de espera" de `js/main.js`.

A aba **Lista de espera** é criada sozinha no primeiro cadastro, com as colunas
Data (UTC), E-mail, Perfil e Origem. E-mail repetido não gera linha nova.

## Ao alterar o script

Depois de editar o código no Apps Script, use **Implantar → Gerenciar
implantações → editar → Nova versão**. Isso mantém a mesma URL; criar uma
implantação nova gera outra URL e exige atualizar `js/main.js`.

## Observações

- A URL fica pública no JS do site; isso é inerente a um site estático. O
  script valida o e-mail, ignora envios com o campo honeypot `website`
  preenchido e não grava duplicados.
- LGPD: a planilha guarda dados pessoais (e-mail). Restrinja o compartilhamento
  dela a quem precisa e apague os registros quando a lista deixar de ser usada.
