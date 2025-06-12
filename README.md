# API de Gerenciamento Estudantil
API para gestão de alunos, professores, matérias e aulas, desenvolvida com Node.js, Express, Prisma e PostgreSQL.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker](https://www.docker.com/get-started/) (para o banco de dados)
- [Git](https://git-scm.com/) (para clonar o repositório)

##Como Executar o Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/gestao-estudantil-api.git
cd gestao-estudantil-api
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o ambiente
Crie um arquivo `.env` na raiz do projeto com:
```env
DATABASE_URL="postgresql://api_user:senha_segura@localhost:5432/gestao_estudantil?schema=public"
```

### 4. Inicie o PostgreSQL com Docker
```bash
docker-compose up -d
```

### 5. Execute as migrações do banco de dados
```bash
npx prisma migrate dev --name init
```

### 6. Inicie a API
```bash
node src/index.js
```
A API estará disponível em: `http://localhost:3000`

## Endpoints Principais

| Método | Endpoint       | Descrição               |
|--------|----------------|-------------------------|
| GET    | `/alunos`      | Lista todos os alunos   |
| POST   | `/alunos`      | Cria um novo aluno      |
| GET    | `/professores` | Lista todos os professores |

## Ferramentas Úteis

- **Prisma Studio**: Para visualizar os dados:
  ```bash
  npx prisma studio
  ```
  Acesse: `http://localhost:5555`

- **Testar API**: Use [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/).
