# Sistema de Saúde — ES2

Sistema web para gerenciamento de profissionais de saúde, atendimentos e exames laboratoriais, desenvolvido como projeto da disciplina de Engenharia de Software II.

🔗 **Aplicação em produção:** [https://es2-saude.onrender.com](https://es2-saude.onrender.com)

---

## Tecnologias

- **Java 17**
- **Spring Boot 4.0.6** (Web MVC, Data JPA, Validation)
- **PostgreSQL**
- **Lombok**
- **Maven**
- **Docker** (deploy via Render.com)
- **HTML / CSS / JavaScript** (frontend estático)

---

## Funcionalidades

### Profissionais de Saúde
- Cadastro, edição e exclusão de profissionais
- Busca por nome ou categoria
- Categorias disponíveis: `MEDICO`, `PSICOLOGO`, `FISIOTERAPEUTA`

### Atendimentos
- Registro de atendimentos vinculados a um profissional
- Campos: data, horário, descrição do problema e receita
- Listagem e exclusão de atendimentos

### Exames Laboratoriais
- Cadastro de exames vinculados a um atendimento
- Listagem e exclusão de exames

---

## Endpoints da API

### Profissionais — `/profissionais`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/profissionais` | Lista todos os profissionais |
| `GET` | `/profissionais/{id}` | Busca por ID |
| `GET` | `/profissionais/buscar?nome=` | Busca por nome |
| `GET` | `/profissionais/categoria?categoria=` | Busca por categoria |
| `POST` | `/profissionais` | Cadastra novo profissional |
| `PUT` | `/profissionais/{id}` | Atualiza profissional |
| `DELETE` | `/profissionais/{id}` | Remove profissional |

### Atendimentos — `/atendimentos`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/atendimentos` | Lista todos os atendimentos |
| `GET` | `/atendimentos/{id}` | Busca por ID |
| `POST` | `/atendimentos` | Registra novo atendimento |
| `PUT` | `/atendimentos/{id}` | Atualiza atendimento |
| `DELETE` | `/atendimentos/{id}` | Remove atendimento |

### Exames — `/exames`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/exames` | Lista todos os exames |
| `GET` | `/exames/{id}` | Busca por ID |
| `POST` | `/exames` | Cadastra novo exame |
| `DELETE` | `/exames/{id}` | Remove exame |

---

## Como executar localmente

### Pré-requisitos
- Java 17+
- Maven
- PostgreSQL rodando localmente

### Configuração

1. Clone o repositório:
```bash
git clone https://github.com/guilhermeRBB/es2-saude.git
cd es2-saude
```

2. Configure o banco de dados em `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/es2-saude-db
spring.datasource.username=postgres
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```

3. Execute a aplicação:
```bash
./mvnw spring-boot:run
```

4. Acesse em: [http://localhost:8080](http://localhost:8080)

---

## Deploy com Docker

```bash
docker build -t es2-saude .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://<host>/<db> \
  -e SPRING_DATASOURCE_USERNAME=<user> \
  -e SPRING_DATASOURCE_PASSWORD=<senha> \
  es2-saude
```

---

## Estrutura do Projeto

```
src/
├── main/
│   ├── java/br/com/example/es2_saude/
│   │   ├── controller/      # Endpoints REST
│   │   ├── model/           # Entidades JPA
│   │   │   └── enums/       # Enum de categorias
│   │   ├── repository/      # Interfaces JPA
│   │   └── service/         # Regras de negócio
│   └── resources/
│       ├── static/          # Frontend (HTML, CSS, JS)
│       └── application.properties
```
