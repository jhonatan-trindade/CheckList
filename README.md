# Plantão — Sala de Coordenação Operacional CEB

Checklist da rotina do plantão da Sala de Coordenação (CBMMG · CEB · FTP 2026)
com gerador do **relatório de serviço em HTML para importar no SEI**.

O projeto é um **Google Apps Script** vinculado a uma planilha do Drive e
publicado como **Web App**. A página é servida exatamente como o HTML original —
nenhuma lógica de funcionamento foi alterada.

## Arquivos

| Arquivo no repositório | Vira no Apps Script | O que é |
|------------------------|---------------------|---------|
| `Codigo.gs`            | `Codigo.gs`         | Publica a página (`doGet`), menu e diálogo na planilha. |
| `Index.html`           | `Index.html`        | A aplicação completa (checklist + relatório). Todo o código está aqui. |
| `appsscript.json`      | Manifesto do projeto | Fuso horário e configuração do Web App. |

## Como montar o projeto no Apps Script

1. Crie a **planilha** nova no Google Drive.
2. Nela, abra **Extensões → Apps Script**. Isso cria um projeto vinculado à planilha.
3. No editor do Apps Script:
   - Renomeie o arquivo `Código.gs` inicial (ou apague o conteúdo) e cole o conteúdo de **`Codigo.gs`** deste repositório.
   - Clique em **+ → HTML**, crie um arquivo chamado **`Index`** (sem a extensão, o Apps Script adiciona `.html` sozinho) e cole o conteúdo de **`Index.html`**.
   - (Opcional) Em **Configurações do projeto → “Mostrar arquivo de manifesto appsscript.json no editor”**, marque a opção e cole o conteúdo de **`appsscript.json`**.
4. **Salve** (ícone de disquete).

> Importante: o arquivo HTML **precisa** se chamar `Index`, porque o `doGet` usa
> `HtmlService.createHtmlOutputFromFile('Index')`. Se usar outro nome, ajuste o `Codigo.gs`.

## Como publicar como Web App (link para usar no plantão)

1. No editor, clique em **Implantar → Nova implantação**.
2. Em “Selecionar tipo”, escolha **App da Web**.
3. Configure:
   - **Executar como:** Eu (sua conta).
   - **Quem pode acessar:** conforme a necessidade do serviço (ex.: *Qualquer pessoa* ou *Qualquer pessoa na organização*).
4. Clique em **Implantar** e autorize as permissões solicitadas.
5. Copie a **URL do app da Web** — é o link do checklist para abrir no plantão.

Para atualizar depois de mudar o código: **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão → Implantar**.

## Uso rápido pela própria planilha (sem publicar)

Ao abrir a planilha, aparece o menu **“Plantão CEB → Abrir checklist”**, que abre
a aplicação em uma janela dentro da planilha. Útil para testar antes de publicar.

## Observações

- O progresso do checklist e os dados do relatório ficam salvos no **navegador do
  dispositivo** (`localStorage`), como no HTML original. Cada dispositivo mantém o
  seu próprio andamento; “Novo plantão” limpa as marcações.
- O relatório do SEI continua sendo gerado no próprio navegador (botões **Baixar
  HTML do SEI** e **Copiar código**). A planilha serve apenas como container do
  projeto Apps Script.
