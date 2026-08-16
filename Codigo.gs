/**
 * Plantão — Sala de Coordenação Operacional CEB
 * Checklist da rotina + gerador do relatório de serviço para o SEI.
 *
 * Projeto Google Apps Script (vinculado a uma planilha do Drive) que serve
 * a página como um Web App. Toda a lógica de funcionamento fica no arquivo
 * Index.html — este arquivo apenas publica a página.
 */

/**
 * Ponto de entrada do Web App.
 * Chamado automaticamente pelo Apps Script quando alguém abre a URL do app.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Plantão — Sala de Coordenação Operacional CEB')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Permite reaproveitar trechos de HTML com <?!= include('arquivo') ?>,
 * caso você queira dividir o Index em partes no futuro.
 * Não é usado pela versão atual (arquivo único), mas fica disponível.
 */
function include(nomeArquivo) {
  return HtmlService.createHtmlOutputFromFile(nomeArquivo).getContent();
}

/**
 * Adiciona um menu na planilha para abrir/publicar o checklist facilmente.
 * Executado automaticamente ao abrir a planilha que hospeda este script.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Plantão CEB')
    .addItem('Abrir checklist', 'abrirChecklist')
    .addToUi();
}

/**
 * Abre o checklist em uma janela (diálogo) dentro da própria planilha.
 * Útil para testar sem precisar publicar o Web App.
 */
function abrirChecklist() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1000)
    .setHeight(720)
    .setTitle('Plantão — Sala de Coordenação Operacional CEB');
  SpreadsheetApp.getUi().showModalDialog(html, 'Plantão — Sala de Coordenação');
}
