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

const form = document.getElementById('formRsvp');
const { nome, presenca, acompanhante, mensagem } = form.elements;
function ajustarQuantidade() {
  const vai = presenca.value === 'sim';
  acompanhante.disabled = !vai;
  document.getElementById('grupo-pessoas').hidden = !vai;
}
presenca.addEventListener('change', ajustarQuantidade);
window.addEventListener('pageshow', ajustarQuantidade);
ajustarQuantidade();
form.addEventListener('submit', event => {
  event.preventDefault();
  const vai = presenca.value === 'sim';
  const texto = [
    'Olá! Aqui é ' + nome.value.trim() + '.',
    vai ? 'Sim, estarei lá!' : 'Não poderei ir.',
    vai && (acompanhante.value.trim() ? 'Acompanhante: ' + acompanhante.value.trim() : 'Vou sem acompanhante.'),
    vai && 'Total de pessoas: ' + (acompanhante.value.trim() ? 2 : 1),
    mensagem.value.trim() && 'Recado: ' + mensagem.value.trim()
  ].filter(Boolean).join('\n');
  window.location.assign('https://wa.me/5515997228905?text=' + encodeURIComponent(texto));
});
