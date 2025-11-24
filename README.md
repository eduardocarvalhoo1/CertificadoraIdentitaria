# Oficinas+

> *Projeto Final:* Disciplina AS65A - Certificadora de Competência Identitária - N15 (2025_02)

O *Oficinas+* é uma aplicação Full Stack desenvolvida para centralizar o gerenciamento de oficinas acadêmicas, permitindo o cadastro de eventos, controle de inscrições de alunos e gestão administrativa.

---

## 👥 1. Identificação da Equipe
* *Eduardo Carvalho de Oliveira* - RA: 2614529
* *Júlio Cézar Bandeira Covary* - RA: 2612224
* *Luan Venicios Salomão de Almeida* - RA: 2564220
* *Matheus Faustino Meneguim* - RA: 2564823
* *Murillo Tadeu Amadeu* - RA: 2564246

---

## 🎯 2. Objetivo e Funcionalidades
O objetivo do sistema é facilitar a organização e o controle de oficinas acadêmicas, eliminando o uso de planilhas descentralizadas e garantindo a integridade das inscrições.

*Funcionalidades Desenvolvidas:*
1.  *Módulo Público:* Visualização de oficinas disponíveis (Dashboard).
2.  *Módulo Professor (Admin):* Cadastro, edição e exclusão de oficinas; gestão de salas; visualização de lista de presença.
3.  *Módulo Aluno:* Inscrição em oficinas (com validação de vagas) e cancelamento de inscrição.
4.  *Autenticação:* Login seguro com distinção de níveis de acesso (Professor/Aluno).

---

## 🛠 3. Ferramentas e Tecnologias (Requisitos para Compilação)

Para codificar, compilar e executar este projeto, foram utilizadas as ferramentas e bibliotecas listadas abaixo. É necessário ter o ambiente configurado com versões compatíveis.

### 3.1. Ferramentas de Base (Ambiente)
| Ferramenta | Versão Utilizada | Link para Download |
| :--- | :--- | :--- |
| *Node.js* | ^21.7.0 | [nodejs.org](https://nodejs.org/) |
| *NPM* | ^10.x | (Instalado com o Node) |
| *Git* | ^2.49.x | [git-scm.com](https://git-scm.com/) |
| *VS Code* | ^1.106.0 | [code.visualstudio.com](https://code.visualstudio.com/) |

### 3.2. Banco de Dados
| Tecnologia | Tipo | Link Oficial |
| :--- | :--- | :--- |
| *Firebase Firestore* | NoSQL (Cloud) | [firebase.google.com](https://firebase.google.com/) |

### 3.3. Bibliotecas Principais (Dependências)
| Biblioteca | Versão | Função | Link |
| :--- | :--- | :--- | :--- |
| *Express* | ^4.x | Framework Backend | [npmjs.com/package/express](https://www.npmjs.com/package/express) |
| *React* | ^18.x | Biblioteca Frontend | [react.dev](https://react.dev/) |
| *Firebase Admin* | ^13.5.0 | SDK do Banco de Dados | [npmjs.com/package/firebase-admin](https://www.npmjs.com/package/firebase-admin) |
| *JsonWebToken* | ^9.x | Autenticação (JWT) | [npmjs.com/package/jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) |
| *Bcrypt* | ^5.x | Criptografia | [npmjs.com/package/bcrypt](https://www.npmjs.com/package/bcrypt) |

---

## 🔐 4. Autenticação e Segurança

O sistema utiliza autenticação robusta para proteger os dados:
* *JWT (JSON Web Token):* Utilizado para controle de sessão stateless.
* *Bcrypt:* Utilizado para criptografia (hash) das senhas no banco de dados.
* *Middlewares:* As rotas protegidas interceptam as requisições para validar o token antes de permitir o acesso.

---

## 📂 5. Estrutura da API (Rotas)

Abaixo estão os principais endpoints disponíveis na API:

### 🔓 Públicas e Autenticação
* GET /api/public - Dados para dashboard inicial.
* POST /api/auth/login - Autenticação de usuários.
* POST /api/auth/register - Cadastro de novos usuários.
* GET /api/docs - Documentação Swagger.

### 👤 User
* GET /api/auth/profile/:id - Busca o perfil do usuário
* PUT /api/auth/profile/:id - Atualiza o perfil do usuário
* PUT /api/auth/password/:id - Atualiza a senha do usuário

### 👨‍🏫 Professores e Salas
* GET /api/professor - Lista professores cadastrados.
* GET /api/salas - Lista locais disponíveis.
* POST /api/salas - Cadastra nova sala (Admin).

### 👩‍🎓 Alunos
* GET /api/alunos - Listagem de alunos.
* PUT /api/alunos/:id - Atualização de perfil.

### 🛠 Oficinas (Core)
* GET /api/oficinas - Lista oficinas.
* POST /api/oficinas - Cria nova oficina (Professor).
* POST /api/oficinas/:id/inscrever - Realiza inscrição do aluno.
* DELETE /api/oficinas/:id/inscrever - Cancela a inscrição do aluno.
* GET /api/oficinas/:id/inscritos - Lista os alunos inscritos na oficina.

---

## ⚙️ 6. Roteiro para Configuração do Banco de Dados

O sistema utiliza o *Firebase Firestore* (em nuvem). Não é necessária a instalação de um SGBD local, mas é *obrigatória a configuração das credenciais*.

*⚠️ IMPORTANTE:* Por segurança, os arquivos de chave privada não estão neste repositório.
1.  Obtenha o arquivo credenciais_projeto.zip (enviado em anexo na entrega da tarefa ou via link do Drive disponibilizado).
2.  Extraia o arquivo *serviceAccountKey.json*.
3.  Extraia o arquivo *.env*.
4.  Coloque ambos os arquivos dentro da pasta: server/config/.

## 💾 6.1 Mini Tutorial – Criando o Firestore e Obtendo as Credenciais (caso seja necessário)

Caso seja necessário criar o Firestore manualmente, siga os passos:

1. Acesse: https://console.firebase.google.com

2. Clique em Criar Projeto → dê um nome qualquer.

3. No menu lateral, vá em Firestore Database → Criar banco de dados → modo de teste.

4. Vá em Configurações do Projeto → Contas de Serviço.

5. Clique em Gerar nova chave privada → isso fará download do arquivo serviceAccountKey.json.
   
6. Coloque o arquivo serviceAccountKey.json dentro de ./server/config

7. Crie um arquivo .env dentro de ./server/config/ com o campo:

```
JWT_SECRET=sua_chave_aqui
```
---

## 🚀 7. Roteiro para Instalação e Execução

## Requisitos
* Ter o Node instalado (versão recomendada: 20 ou superior)
* Ter o Banco de dados Firebase configurado

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/eduardocarvalhoo1/CertificadoraIdentitaria.git
```

### Passo 2: Configurar e Rodar o backend
1. Acesse a pasta do servidor:
```bash
cd server
```

3. Configuração de Credenciais: 
Certifique-se de que colou os arquivos serviceAccountKey.json e .env na pasta server/config/.

4. Instale as dependências e inicie:
```bash
npm install
```
```bash
npm start
```

Sucesso: O terminal exibirá "Server running on port 8000" e "✅ Firestore connection OK".

### Passo 3: Rodar o frontend
1. Abra um novo terminal na raiz do projeto
2. Instale as dependências e inicie:
```bash
npm install
```
```bash
npm start
```
3. O navegador abrirá automaticamente o endereço local (ex: http://localhost:3000).

## 🧪 8. Roteiro de Testes
8.1. Contas de Acesso Padrão
| Perfil | E-mail | Senha |
| Professor (Admin) | professor@teste.com | 123456 |
| Aluno | aluno@teste.com | 123456 |

8.2. Passo a Passo de Teste
Login Professor: Acesse com a conta de professor.

Criar Sala: Cadastre um local (ex: "Lab 01").

Criar Oficina: Crie uma oficina vinculada a essa sala e defina vagas.

Login Aluno: Entre com a conta de aluno.

Inscrição: Inscreva-se na oficina criada e verifique o decremento de vagas.

Validação: Volte ao perfil de professor e confira a lista de inscritos.

📄 Licença
Projeto desenvolvido com finalidade exclusivamente educacional.
