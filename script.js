const contagem = document.getElementById('contagem');
function atualizarContagem() {
  const hoje = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
  const partes = hoje.split('-').map(Number);
  const dias = Math.round((Date.UTC(2027, 3, 3) - Date.UTC(partes[0], partes[1] - 1, partes[2])) / 86400000);
  contagem.textContent = dias > 0 ? `Falta${dias === 1 ? '' : 'm'} ${dias} dia${dias === 1 ? '' : 's'} para o nosso casamento` : dias === 0 ? 'Hoje é o nosso casamento!' : 'Obrigado por fazer parte da nossa história.';
}
atualizarContagem();
setInterval(atualizarContagem, 60000);
