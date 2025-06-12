const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Para receber JSON no corpo das requisições

// Rota de teste
app.get('/', (req, res) => {
  res.send('API de Gestão Estudantil Funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// CRUD de Alunos
app.get('/alunos', async (req, res) => {
  const alunos = await prisma.aluno.findMany();
  res.json(alunos);
});

app.post('/alunos', async (req, res) => {
  const { nome, matricula, email } = req.body;
  try {
    const novoAluno = await prisma.aluno.create({
      data: { nome, matricula, email }
    });
    res.status(201).json(novoAluno);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar aluno" });
  }
});

// Rota para criação em massa de alunos (POST /alunos/bulk)
app.post('/alunos/bulk', async (req, res) => {
  const alunos = req.body;

  // Validação mais completa
  if (!Array.isArray(alunos)) {
    return res.status(400).json({ 
      error: "O payload deve ser um array de alunos",
      example: [{ nome: "João", email: "joao@exemplo.com" }]
    });
  }

  if (alunos.length === 0) {
    return res.status(400).json({ error: "O array de alunos está vazio" });
  }

  // Validação de campos obrigatórios para cada aluno
  const requiredFields = ['nome', 'email']; // ajuste conforme seu modelo
  const alunosComErros = [];

  alunos.forEach((aluno, index) => {
    const missingFields = requiredFields.filter(field => !aluno[field]);
    if (missingFields.length > 0) {
      alunosComErros.push({
        index,
        error: `Campos obrigatórios faltando: ${missingFields.join(', ')}`,
        aluno
      });
    }
  });

  if (alunosComErros.length > 0) {
    return res.status(400).json({
      error: "Alguns alunos têm dados inválidos",
      invalidAlunos: alunosComErros,
      totalErrors: alunosComErros.length
    });
  }

  try {
  
    const alunosCriados = await prisma.aluno.createMany({
      data: alunos,
      skipDuplicates: true // opcional: pular registros com emails duplicados, por exemplo
    });


    res.status(201).json({
      success: true,
      totalCreated: alunosCriados.count,
      message: `Alunos criados com sucesso`
    });

  } catch (error) {
    console.error("Erro ao criar alunos em massa:", error);

    // Tratamento específico para violação de constraint única (como email duplicado)
    if (error.code === 'P2002') {
      const field = error.meta?.target?.join(', ') || 'campo único';
      return res.status(409).json({
        error: `Conflito em ${field}`,
        message: `Um ou mais alunos contêm valores duplicados para ${field}`
      });
    }

    res.status(500).json({
      error: "Falha ao criar alunos em massa",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      suggestion: "Verifique os dados e tente novamente. Para muitos registros, considere enviar em lotes menores."
    });
  }
});