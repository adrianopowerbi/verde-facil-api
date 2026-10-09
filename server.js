const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ecopontos = [
  { id: 1, nome: 'Ecoponto Centro', materiais: 'Garrafas PET, Papelão, Vidro e Latas' },
  { id: 2, nome: 'Ecoponto Bairro Pimenta', materiais: 'Medicamentos vencidos, Pilhas e Baterias' },
  { id: 3, nome: 'Ecoponto Visgueirão', materiais: 'Plásticos rígidos e Eletrônicos' }
];

const denuncias = [];

function normalizar(texto) {
  return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Tarefa 1: rota de teste
app.get('/saude', (req, res) => res.json({ ok: true }));

// Tarefa 2: login por e-mail
app.post('/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ erro: 'E-mail é obrigatório' });
  res.json({ usuario: email });
});

// Tarefas 3 e 4: listar ecopontos, com filtro opcional (?busca=)
app.get('/ecopontos', (req, res) => {
  const busca = normalizar(req.query.busca || '');
  const lista = ecopontos.filter(e =>
    normalizar(e.nome + ' ' + e.materiais).includes(busca)
  );
  res.json(lista);
});

// Tarefas 5 e 8: criar denúncia (com validação)
app.post('/denuncias', (req, res) => {
  const { local, descricao, autor } = req.body;
  if (!local || !descricao) {
    return res.status(400).json({ erro: 'Local e descrição são obrigatórios' });
  }
  const nova = {
    id: Date.now(),
    local,
    descricao,
    autor: autor || 'Anônimo',
    status: 'Em Análise',
    criadaEm: new Date().toISOString()
  };
  denuncias.unshift(nova);
  res.status(201).json(nova);
});

// Tarefa 6: listar denúncias
app.get('/denuncias', (req, res) => res.json(denuncias));

// Tarefa 7: alterar status da denúncia
app.patch('/denuncias/:id', (req, res) => {
  const d = denuncias.find(x => x.id === Number(req.params.id));
  if (!d) return res.status(404).json({ erro: 'Denúncia não encontrada' });
  d.status = req.body.status || d.status;
  res.json(d);
});

const PORTA = 3000;
app.listen(PORTA, () => console.log('API rodando em http://localhost:' + PORTA));
