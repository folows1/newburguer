(function () {
  "use strict";

  var itens = Array.prototype.slice.call(document.querySelectorAll(".item"));
  var secoes = Array.prototype.slice.call(document.querySelectorAll(".secao"));
  var campo = document.getElementById("busca");
  var filtros = document.getElementById("filtros");
  var vazio = document.getElementById("vazio");
  var filtroAtual = "tudo";

  // Texto normalizado (sem acento) para a busca casar "cafe" com "café".
  function limpar(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  itens.forEach(function (item) {
    item.dataset.busca = limpar(item.textContent);
  });

  function aplicar() {
    var termo = limpar(campo.value.trim());

    itens.forEach(function (item) {
      var tags = item.dataset.tags || "";
      var passaFiltro = filtroAtual === "tudo" || tags.indexOf(filtroAtual) !== -1;
      var passaBusca = termo === "" || item.dataset.busca.indexOf(termo) !== -1;
      item.hidden = !(passaFiltro && passaBusca);
    });

    // Zebra recalculada só sobre o que ficou visível.
    var visiveisTotal = 0;
    secoes.forEach(function (secao) {
      var n = 0;
      Array.prototype.forEach.call(secao.querySelectorAll(".item"), function (item) {
        if (item.hidden) return;
        item.classList.toggle("par", n % 2 === 1);
        n++;
      });
      secao.hidden = n === 0;
      visiveisTotal += n;
    });

    vazio.hidden = visiveisTotal > 0;
  }

  campo.addEventListener("input", aplicar);

  filtros.addEventListener("click", function (e) {
    var botao = e.target.closest(".chip");
    if (!botao) return;
    filtroAtual = botao.dataset.filtro;
    Array.prototype.forEach.call(filtros.querySelectorAll(".chip"), function (c) {
      c.classList.toggle("is-on", c === botao);
    });
    aplicar();
  });

  aplicar();

  // ---- aberto / fechado ----
  // Horário fixo em America/Sao_Paulo para não depender do relógio do aparelho.
  // 0 = domingo. Minutos desde a meia-noite do dia em que o turno começa.
  var TURNOS = {
    0: [1110, 1470], // domingo 18h30 -> 00h30
    2: [1110, 1380], // terça   18h30 -> 23h
    3: [1110, 1380],
    4: [1110, 1380],
    5: [1110, 1470], // sexta   18h30 -> 00h30
    6: [1110, 1470]  // sábado  18h30 -> 00h30
  };

  function agoraEmSaoPaulo() {
    var f = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    });
    var partes = {};
    f.formatToParts(new Date()).forEach(function (p) { partes[p.type] = p.value; });
    var dias = { dom: 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sab: 6 };
    var chave = limpar(partes.weekday).slice(0, 3);
    return {
      dia: dias[chave],
      minutos: parseInt(partes.hour, 10) * 60 + parseInt(partes.minute, 10)
    };
  }

  function estado() {
    var t = agoraEmSaoPaulo();
    if (t.dia === undefined) return null;

    // Turno que começou hoje.
    var hoje = TURNOS[t.dia];
    if (hoje && t.minutos >= hoje[0] && t.minutos < Math.min(hoje[1], 1440)) return true;

    // Turno de ontem que atravessou a meia-noite.
    var ontemDia = (t.dia + 6) % 7;
    var ontem = TURNOS[ontemDia];
    if (ontem && ontem[1] > 1440 && t.minutos < ontem[1] - 1440) return true;

    return false;
  }

  var aberto = estado();
  if (aberto !== null) {
    var alvo = document.getElementById("situacao");
    alvo.hidden = false;
    alvo.classList.add(aberto ? "aberto" : "fechado");
    alvo.innerHTML = aberto
      ? "<b>Aberto agora.</b> Retirada no local."
      : "<b>Fechado agora.</b> Abrimos de terça a domingo, 18h30.";
  }
})();
