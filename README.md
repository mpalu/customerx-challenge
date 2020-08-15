# Desafio FullStack Jr.

Esta aplicação foi desenvolvida como parte do desafio fullstack Jr da CustomerX.

As tecnologias utilizadas foram NodeJS com o framework Express, JavaScript ES6, Bootstrap e Docker.

No futuro irei refatorar o projeto utilizando React e MongoDB. Serão também aplicadas máscaras nos formulários e aperfeiçoadas as validações dos dados e apresentação das informações.

# Requisitos

NodeJS ^13.14, ou Docker v19, que pode ser obtido [aqui](https://docs.docker.com/get-docker/).

# Execução

A aplicação poderá ser executada seguindo os seguintes passos:

1. Clone do projeto
   ```
   git clone https://github.com/mpalu/desafio-fullstack-jr.git && cd desafio-fullstack-jr
   ```
1. Instalação das dependências e execução do projeto

   ```
   npm install && npm start
   ```

   Caso preferir, execute com o Docker

   ```
   docker build -t desafio-fullstack .
   ```

   ```
   docker run -p 8080:8080 -d desafio-fullsatck
   ```

1. Após isso, a aplicação poderá ser acessada por [http://localhost:8080/](http://localhost:8080/)
