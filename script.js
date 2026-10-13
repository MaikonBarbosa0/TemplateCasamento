// ===== CONFIGURAÇÕES: edite aqui =====
const CONFIG = {
  dataCasamento: "2027-04-03T16:00:00-03:00",
  whatsapp: "5515997228905" // DDI + DDD + número, só dígitos
};

// ===== Contagem regressiva =====
const el = id => document.getElementById(id);
const dois = n => String(n).padStart(2, "0");

function atualizarContagem() {
  const falta = new Date(CONFIG.dataCasamento) - new Date();
  if (falta <= 0) {
    el("contagem").innerHTML = "<p>Hoje é o grande dia!</p>";
    return clearInterval(timer);
  }
  const s = Math.floor(falta / 1000);
  el("dias").textContent = dois(Math.floor(s / 86400));
  el("horas").textContent = dois(Math.floor((s % 86400) / 3600));
  el("minutos").textContent = dois(Math.floor((s % 3600) / 60));
  el("segundos").textContent = dois(s % 60);
}
const timer = setInterval(atualizarContagem, 1000);
atualizarContagem();

// ===== Formulário de confirmação (abre o WhatsApp com a resposta) =====
const form = el("formRsvp");
const pessoas = form.elements.pessoas;
form.elements.presenca.addEventListener('change', () => {
  const naoVai = form.elements.presenca.value === 'Não poderei ir';
  pessoas.disabled = naoVai;
  pessoas.value = naoVai ? '0' : '1';
  form.querySelector('[data-erro="pessoas"]').textContent = '';
});
form.addEventListener("submit", e => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(form));
  let valido = true;

  ["nome", "presenca"].forEach(campo => {
    const msg = form.querySelector(`[data-erro="${campo}"]`);
    if (!dados[campo].trim()) {
      msg.textContent = campo === "nome" ? "Informe seu nome." : "Escolha uma opção.";
      valido = false;
    } else {
      msg.textContent = "";
    }
  });
  const vai = dados.presenca === 'Sim, estarei lá';
  const quantidade = vai ? Number(dados.pessoas) : 0;
  const erroPessoas = form.querySelector('[data-erro="pessoas"]');
  if (vai && (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 6)) {
    erroPessoas.textContent = 'Informe de 1 a 6 pessoas, conforme seu convite.';
    valido = false;
  } else {
    erroPessoas.textContent = '';
  }
  if (!valido) {
    form.querySelector('[data-erro]:not(:empty)').parentElement.querySelector('input, select').focus();
    return;
  }

  const texto =
    `Olá! Aqui é ${dados.nome.trim()}.\n` +
    `Presença: ${dados.presenca}\n` +
    `Pessoas: ${quantidade}\n` +
    (dados.mensagem ? `Recado: ${dados.mensagem}` : "");

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  el("status").textContent = "Sua resposta está preparada. Envie a mensagem no WhatsApp para concluir. Se ele não abrir, clique novamente no botão.";
});
