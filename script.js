// ===== CONFIGURAÇÕES: edite aqui =====
const CONFIG = {
  dataCasamento: "2027-04-03T16:00:00-03:00",
  whatsapp: "5515997228905", // DDI + DDD + número, só dígitos
  chavePix: "(15) 997228905"
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

// ===== Copiar chave Pix =====
el("copiarPix").addEventListener("click", async e => {
  const botao = e.currentTarget;
  try {
    await navigator.clipboard.writeText(CONFIG.chavePix);
    botao.textContent = "Chave copiada";
  } catch {
    botao.textContent = "Copie: " + CONFIG.chavePix;
  }
  setTimeout(() => (botao.textContent = "Copiar chave"), 3000);
});

// ===== Formulário de confirmação (abre o WhatsApp com a resposta) =====
const form = el("formRsvp");
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
  if (!valido) return;

  const texto =
    `Olá! Aqui é ${dados.nome}.\n` +
    `Presença: ${dados.presenca}\n` +
    `Pessoas: ${dados.pessoas}\n` +
    (dados.mensagem ? `Recado: ${dados.mensagem}` : "");

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  el("status").textContent = "Obrigado! Sua confirmação foi preparada no WhatsApp.";
  form.reset();
});
