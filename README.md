
# Bolão Copa do Mundo 2022 (API Node.js)

**Descrição:**  
API desenvolvida em Node.js integrada com aplicação React no front-end, para realização de bolão durante a Copa do Mundo de 2022.

---

## 🛠 Tecnologias Utilizadas

- Node.js
- Express
- BCrypt
- Passport
- Sequelize
- Nodemailer
 
---

## 🚀 Funcionalidades

- Cadastro/Login utilizando Passport (com JSON e Google oAuth)
- Redefinição de senha utilizando Nodemailer com envio de email para redifinição de senha
- Comunicação com banco de dados MySQL utilizando Sequelize
- Cálculo automatizado de classificação de grupos e times que avançam nas fase finais a partir do recebimento de palpites do usuário para jogos
- Cálculo automatizado de pontuação dos jogadores a partir de recebimento de resultado de determinado jogo


---

## ⚙️ Como Rodar o Projeto

1. Clone o repositório:  
   ```
   git clone https://github.com/Grynberg34/react-bolao
   ```
2. Instale as dependências:  
   ```
   npm install
   ```
3. Inicie o servidor:  
   ```
   npm start
   ```
4. Acesse em: `http://localhost:8080`