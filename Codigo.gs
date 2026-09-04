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

/* ==================================================================
 * PERSISTÊNCIA NA PLANILHA — um plantão por dia de serviço
 *
 * Cada dia (Data do serviço) vira uma linha na aba "Plantões", guardando
 * em JSON o estado do checklist + o relatório. O botão "Novo plantão"
 * limpa o dia atual; ao trocar a data, carrega/salva o dia correspondente.
 * A página chama estas funções via google.script.run.
 * ================================================================== */

var ABA_PLANTOES = 'Plantões';

/** Devolve (criando se preciso) a aba onde os plantões são guardados. */
function _abaPlantoes_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(ABA_PLANTOES);
  if (!sh) {
    sh = ss.insertSheet(ABA_PLANTOES);
    sh.getRange('A:A').setNumberFormat('@');   // Data como texto, não vira data
    sh.getRange(1, 1, 1, 3)
      .setValues([['Data do serviço', 'Atualizado em', 'Dados (JSON)']])
      .setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setColumnWidth(3, 640);
  }
  return sh;
}

/** Localiza a linha (1-based) de uma data; -1 se não existir. */
function _linhaDaData_(sh, data) {
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var col = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < col.length; i++) {
    if (String(col[i][0]) === String(data)) return i + 2;
  }
  return -1;
}

/**
 * Salva (ou atualiza) o plantão de uma data. `dadosJson` é uma string JSON.
 * Chamada pela página a cada alteração (com atraso/debounce no cliente).
 */
function salvarPlantao(data, dadosJson) {
  if (!data) return { ok: false, erro: 'Data do serviço não informada.' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = _abaPlantoes_();
    var row = _linhaDaData_(sh, data);
    if (row < 0) row = Math.max(sh.getLastRow() + 1, 2);
    sh.getRange(row, 1, 1, 3).setValues([[String(data), new Date(), dadosJson]]);
    return { ok: true, data: String(data) };
  } catch (e) {
    return { ok: false, erro: String(e) };
  } finally {
    lock.releaseLock();
  }
}

/** Devolve a string JSON do plantão de uma data, ou null se não houver. */
function carregarPlantao(data) {
  if (!data) return null;
  var sh = _abaPlantoes_();
  var row = _linhaDaData_(sh, data);
  if (row < 0) return null;
  return sh.getRange(row, 3).getValue() || null;
}

/** Lista as datas já salvas (mais recentes primeiro) — uso opcional. */
function listarPlantoes() {
  var sh = _abaPlantoes_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, 1).getValues()
    .map(function (r) { return String(r[0]); })
    .filter(String)
    .reverse();
}

/**
 * Teste rápido no editor: grava e lê um plantão de exemplo.
 * Rode uma vez (menu Executar) para autorizar o acesso à planilha
 * e conferir se a aba "Plantões" é criada corretamente.
 */
function testePlantao() {
  var r = salvarPlantao('2000-01-01', JSON.stringify({ teste: true, quando: new Date() }));
  Logger.log('salvar: ' + JSON.stringify(r));
  Logger.log('ler: ' + carregarPlantao('2000-01-01'));
}
