function mostrarAlerta(msg, tipo) {
  document.getElementById('alerta').innerHTML =
    `<div class="alert alert-${tipo} alert-dismissible" role="alert">
      ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

function mascaraMoeda(input) {
  let v = input.value.replace(/\D/g, '');
  v = (parseInt(v) / 100).toFixed(2);
  input.value = v === 'NaN' ? '' : v;
}

function mascaraCPF(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}

let editandoFilmeId = null;

function salvarFilme() {
  const titulo = document.getElementById('titulo').value.trim();
  const genero = document.getElementById('genero').value;
  const descricao = document.getElementById('descricao').value.trim();
  const classificacao = document.getElementById('classificacao').value;
  const duracao = document.getElementById('duracao').value;
  const estreia = document.getElementById('estreia').value;

  if (!titulo || !genero || !classificacao || !duracao || !estreia) {
    mostrarAlerta('Preencha todos os campos obrigatórios.', 'danger');
    return;
  }

  const filmes = JSON.parse(localStorage.getItem('filmes') || '[]');

  if (editandoFilmeId) {
    const idx = filmes.findIndex(f => f.id == editandoFilmeId);
    if (idx !== -1) filmes[idx] = { id: editandoFilmeId, titulo, genero, descricao, classificacao, duracao, estreia };
    editandoFilmeId = null;
    document.getElementById('btnSalvarFilme').textContent = 'Salvar Filme';
  } else {
    filmes.push({ id: Date.now(), titulo, genero, descricao, classificacao, duracao, estreia });
  }

  try {
    localStorage.setItem('filmes', JSON.stringify(filmes));
    mostrarAlerta('Filme salvo com sucesso!', 'success');
    ['titulo', 'genero', 'descricao', 'classificacao', 'duracao', 'estreia']
      .forEach(id => document.getElementById(id).value = '');
    renderFilmes();
  } catch (e) {
    mostrarAlerta('Erro ao salvar: armazenamento cheio.', 'danger');
  }
}

function editarFilme(id) {
  const filmes = JSON.parse(localStorage.getItem('filmes') || '[]');
  const f = filmes.find(f => f.id == id);
  if (!f) return;
  document.getElementById('titulo').value = f.titulo;
  document.getElementById('genero').value = f.genero;
  document.getElementById('descricao').value = f.descricao || '';
  document.getElementById('classificacao').value = f.classificacao;
  document.getElementById('duracao').value = f.duracao;
  document.getElementById('estreia').value = f.estreia;
  editandoFilmeId = id;
  document.getElementById('btnSalvarFilme').textContent = 'Atualizar Filme';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function excluirFilme(id) {
  const filmes = JSON.parse(localStorage.getItem('filmes') || '[]').filter(f => f.id != id);
  localStorage.setItem('filmes', JSON.stringify(filmes));
  renderFilmes();
}

function renderFilmes() {
  const filmes = JSON.parse(localStorage.getItem('filmes') || '[]');
  const el = document.getElementById('listaFilmes');
  if (!filmes.length) {
    el.innerHTML = '<p class="text-secondary">Nenhum filme cadastrado.</p>';
    return;
  }
  el.innerHTML = `
    <table class="table table-dark table-striped table-hover">
      <thead><tr>
        <th>Título</th><th>Gênero</th><th>Classificação</th><th>Duração</th><th>Estreia</th><th></th>
      </tr></thead>
      <tbody>
        ${filmes.map(f => `
          <tr>
            <td>${f.titulo}</td>
            <td>${f.genero}</td>
            <td>${f.classificacao}</td>
            <td>${f.duracao} min</td>
            <td>${f.estreia}</td>
            <td class="text-nowrap">
              <button class="btn btn-sm btn-outline-warning me-1" onclick="editarFilme(${f.id})">Editar</button>
              <button class="btn btn-sm btn-outline-danger" onclick="excluirFilme(${f.id})">Excluir</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

let editandoSalaId = null;

function salvarSala() {
  const nomeSala = document.getElementById('nomeSala').value.trim();
  const capacidade = document.getElementById('capacidade').value;
  const tipo = document.getElementById('tipo').value;

  if (!nomeSala || !capacidade || !tipo) {
    mostrarAlerta('Preencha todos os campos.', 'danger');
    return;
  }

  const salas = JSON.parse(localStorage.getItem('salas') || '[]');

  if (editandoSalaId) {
    const idx = salas.findIndex(s => s.id == editandoSalaId);
    if (idx !== -1) salas[idx] = { id: editandoSalaId, nomeSala, capacidade, tipo };
    editandoSalaId = null;
    document.getElementById('btnSalvarSala').textContent = 'Salvar Sala';
  } else {
    salas.push({ id: Date.now(), nomeSala, capacidade, tipo });
  }

  try {
    localStorage.setItem('salas', JSON.stringify(salas));
    mostrarAlerta('Sala salva com sucesso!', 'success');
    ['nomeSala', 'capacidade', 'tipo'].forEach(id => document.getElementById(id).value = '');
    renderSalas();
  } catch (e) {
    mostrarAlerta('Erro ao salvar: armazenamento cheio.', 'danger');
  }
}

function editarSala(id) {
  const salas = JSON.parse(localStorage.getItem('salas') || '[]');
  const s = salas.find(s => s.id == id);
  if (!s) return;
  document.getElementById('nomeSala').value = s.nomeSala;
  document.getElementById('capacidade').value = s.capacidade;
  document.getElementById('tipo').value = s.tipo;
  editandoSalaId = id;
  document.getElementById('btnSalvarSala').textContent = 'Atualizar Sala';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function excluirSala(id) {
  const salas = JSON.parse(localStorage.getItem('salas') || '[]').filter(s => s.id != id);
  localStorage.setItem('salas', JSON.stringify(salas));
  renderSalas();
}

function renderSalas() {
  const salas = JSON.parse(localStorage.getItem('salas') || '[]');
  const el = document.getElementById('listaSalas');
  if (!salas.length) {
    el.innerHTML = '<p class="text-secondary">Nenhuma sala cadastrada.</p>';
    return;
  }
  el.innerHTML = `
    <table class="table table-dark table-striped table-hover">
      <thead><tr>
        <th>Nome</th><th>Capacidade</th><th>Tipo</th><th></th>
      </tr></thead>
      <tbody>
        ${salas.map(s => `
          <tr>
            <td>${s.nomeSala}</td>
            <td>${s.capacidade}</td>
            <td>${s.tipo}</td>
            <td class="text-nowrap">
              <button class="btn btn-sm btn-outline-warning me-1" onclick="editarSala(${s.id})">Editar</button>
              <button class="btn btn-sm btn-outline-danger" onclick="excluirSala(${s.id})">Excluir</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ===== SESSÕES ===== */
function carregarSelectsSessao() {
  const filmes = JSON.parse(localStorage.getItem('filmes') || '[]');
  const salas = JSON.parse(localStorage.getItem('salas') || '[]');
  const selectFilme = document.getElementById('selectFilme');
  const selectSala = document.getElementById('selectSala');

  filmes.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.titulo;
    selectFilme.appendChild(opt);
  });

  salas.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.nomeSala} (${s.tipo})`;
    selectSala.appendChild(opt);
  });
}

let editandoSessaoId = null;

function salvarSessao() {
  const filmeId = document.getElementById('selectFilme').value;
  const salaId = document.getElementById('selectSala').value;
  const dataHora = document.getElementById('dataHora').value;
  const precoRaw = document.getElementById('preco').value;
  const idioma = document.getElementById('idioma').value;
  const formato = document.getElementById('formato').value;

  if (!filmeId || !salaId || !dataHora || !precoRaw || !idioma || !formato) {
    mostrarAlerta('Preencha todos os campos.', 'danger');
    return;
  }

  const filmes = JSON.parse(localStorage.getItem('filmes') || '[]');
  const salas = JSON.parse(localStorage.getItem('salas') || '[]');
  const filme = filmes.find(f => f.id == filmeId);
  const sala = salas.find(s => s.id == salaId);
  const preco = parseFloat(precoRaw).toFixed(2);
  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');

  if (editandoSessaoId) {
    const idx = sessoes.findIndex(s => s.id == editandoSessaoId);
    if (idx !== -1) sessoes[idx] = { id: editandoSessaoId, filmeId, salaId, filmeTitulo: filme.titulo, salaNome: sala.nomeSala, dataHora, preco, idioma, formato };
    editandoSessaoId = null;
    document.getElementById('btnSalvarSessao').textContent = 'Salvar Sessão';
  } else {
    sessoes.push({ id: Date.now(), filmeId, salaId, filmeTitulo: filme.titulo, salaNome: sala.nomeSala, dataHora, preco, idioma, formato });
  }

  try {
    localStorage.setItem('sessoes', JSON.stringify(sessoes));
    mostrarAlerta('Sessão salva com sucesso!', 'success');
    ['selectFilme', 'selectSala', 'dataHora', 'preco', 'idioma', 'formato']
      .forEach(id => document.getElementById(id).value = '');
    renderSessoesCadastro();
  } catch (e) {
    mostrarAlerta('Erro ao salvar: armazenamento cheio.', 'danger');
  }
}

function editarSessao(id) {
  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');
  const s = sessoes.find(s => s.id == id);
  if (!s) return;
  document.getElementById('selectFilme').value = s.filmeId;
  document.getElementById('selectSala').value = s.salaId;
  document.getElementById('dataHora').value = s.dataHora;
  document.getElementById('preco').value = s.preco;
  document.getElementById('idioma').value = s.idioma;
  document.getElementById('formato').value = s.formato;
  editandoSessaoId = id;
  document.getElementById('btnSalvarSessao').textContent = 'Atualizar Sessão';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function excluirSessao(id) {
  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]').filter(s => s.id != id);
  localStorage.setItem('sessoes', JSON.stringify(sessoes));
  renderSessoesCadastro();
}

function renderSessoesCadastro() {
  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');
  const el = document.getElementById('listaSessoes');
  if (!sessoes.length) {
    el.innerHTML = '<p class="text-secondary">Nenhuma sessão cadastrada.</p>';
    return;
  }
  el.innerHTML = `
    <table class="table table-dark table-striped table-hover">
      <thead><tr>
        <th>Filme</th><th>Sala</th><th>Data e Hora</th><th>Preço</th><th>Idioma</th><th>Formato</th><th></th>
      </tr></thead>
      <tbody>
        ${sessoes.map(s => `
          <tr>
            <td>${s.filmeTitulo}</td>
            <td>${s.salaNome}</td>
            <td>${s.dataHora.replace('T', ' ')}</td>
            <td>R$ ${parseFloat(s.preco).toFixed(2)}</td>
            <td>${s.idioma}</td>
            <td>${s.formato}</td>
            <td class="text-nowrap">
              <button class="btn btn-sm btn-outline-warning me-1" onclick="editarSessao(${s.id})">Editar</button>
              <button class="btn btn-sm btn-outline-danger" onclick="excluirSessao(${s.id})">Excluir</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ===== SESSÕES DISPONÍVEIS ===== */
function renderSessoesDisponiveis() {
  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');
  const el = document.getElementById('containerSessoes');

  if (!sessoes.length) {
    el.innerHTML = '<p class="text-secondary">Nenhuma sessão disponível no momento.</p>';
    return;
  }

  el.innerHTML = '<div class="row g-3">' +
    sessoes.map(s => `
      <div class="col-md-4">
        <div class="sessao-card">
          <h5>${s.filmeTitulo}</h5>
          <div class="info">
            <div><strong>Sala:</strong> ${s.salaNome}</div>
            <div><strong>Data:</strong> ${s.dataHora.replace('T', ' ')}</div>
            <div><strong>Idioma:</strong> ${s.idioma} &bull; <strong>Formato:</strong> ${s.formato}</div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="preco">R$ ${parseFloat(s.preco).toFixed(2)}</span>
            <a href="venda-ingressos.html?sessao=${s.id}" class="btn btn-sm btn-warning">Comprar Ingresso</a>
          </div>
        </div>
      </div>`).join('') +
    '</div>';
}

/* ===== VENDA DE INGRESSOS ===== */
function carregarSessoesVenda() {
  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');
  const select = document.getElementById('selectSessao');
  const params = new URLSearchParams(window.location.search);
  const sessaoParam = params.get('sessao');

  sessoes.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.filmeTitulo} - ${s.salaNome} - ${s.dataHora.replace('T', ' ')}`;
    if (sessaoParam && s.id == sessaoParam) opt.selected = true;
    select.appendChild(opt);
  });
}

function confirmarVenda() {
  const sessaoId = document.getElementById('selectSessao').value;
  const nomeCliente = document.getElementById('nomeCliente').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const assento = document.getElementById('assento').value.trim();
  const pagamento = document.getElementById('pagamento').value;

  if (!sessaoId || !nomeCliente || !cpf || !assento || !pagamento) {
    mostrarAlerta('Preencha todos os campos.', 'danger');
    return;
  }

  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');
  const sessao = sessoes.find(s => s.id == sessaoId);

  const ingressos = JSON.parse(localStorage.getItem('ingressos') || '[]');
  ingressos.push({
    id: Date.now(),
    sessaoId,
    filmeTitulo: sessao.filmeTitulo,
    salaNome: sessao.salaNome,
    dataHora: sessao.dataHora,
    nomeCliente, cpf, assento, pagamento,
    preco: sessao.preco
  });

  try {
    localStorage.setItem('ingressos', JSON.stringify(ingressos));
    mostrarAlerta('Ingresso vendido com sucesso!', 'success');
    ['selectSessao', 'nomeCliente', 'cpf', 'assento', 'pagamento']
      .forEach(id => document.getElementById(id).value = '');
    renderIngressos();
  } catch (e) {
    mostrarAlerta('Erro ao salvar: armazenamento cheio.', 'danger');
  }
}

function renderIngressos() {
  const ingressos = JSON.parse(localStorage.getItem('ingressos') || '[]');
  const el = document.getElementById('listaIngressos');
  if (!ingressos.length) {
    el.innerHTML = '<p class="text-secondary">Nenhum ingresso vendido.</p>';
    return;
  }
  el.innerHTML = `
    <table class="table table-dark table-striped table-hover">
      <thead><tr>
        <th>Filme</th><th>Sala</th><th>Data e Hora</th><th>Cliente</th><th>Assento</th><th>Pagamento</th><th>Preço</th>
      </tr></thead>
      <tbody>
        ${ingressos.map(i => `
          <tr>
            <td>${i.filmeTitulo}</td>
            <td>${i.salaNome}</td>
            <td>${i.dataHora.replace('T', ' ')}</td>
            <td>${i.nomeCliente}</td>
            <td>${i.assento}</td>
            <td>${i.pagamento}</td>
            <td>R$ ${parseFloat(i.preco).toFixed(2)}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ===== INDEX - SESSÕES EM CARTAZ ===== */
function renderSessoesIndex() {
  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');
  const el = document.getElementById('sessoesEmCartaz');
  if (!el) return;

  if (!sessoes.length) {
    el.innerHTML = '<p class="text-secondary">Nenhuma sessão disponível no momento.</p>';
    return;
  }

  el.innerHTML = '<div class="row g-3">' +
    sessoes.slice(0, 6).map(s => `
      <div class="col-md-4">
        <div class="sessao-card">
          <h5>${s.filmeTitulo}</h5>
          <div class="info">
            <div><strong>Sala:</strong> ${s.salaNome}</div>
            <div><strong>Data:</strong> ${s.dataHora.replace('T', ' ')}</div>
            <div><strong>Idioma:</strong> ${s.idioma} &bull; <strong>Formato:</strong> ${s.formato}</div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="preco">R$ ${parseFloat(s.preco).toFixed(2)}</span>
            <a href="venda-ingressos.html?sessao=${s.id}" class="btn btn-sm btn-warning">Comprar</a>
          </div>
        </div>
      </div>`).join('') +
    '</div>';
}
