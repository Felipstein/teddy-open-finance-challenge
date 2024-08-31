# 0.1.0
## 29-08-2024
- Monorepo iniciado
- Projeto Core iniciado
- Arquitetura, Design e Infraestrutura montada
- Caso de usos p/ autenticação adicionados: Login, Cadastro e Validação de Token
- Caso de uso adicionado: Gerar link encurtado

## 30-08-2024
- Casos de usos adicionados: Listar links gerados, Editar link gerado, Excluir link gerado, Acessar link encurtado (redirecionar e contabilizar)

## 31-08-2024
- Primeira release da aplicação (implementação do servidor HTTP, sistema de autenticação/autorização e controllers)
- Controllers adicionados: Validação de token, login, cadastro, acesso ao link encurtado, remoção de link encurtado, listagem de links gerados, edição de link gerado e geração de link encurtado
- Controller especial adicionado: verificação se um código já está sendo usado para afins de melhoria na UX de aplicações web e mobile.
- Implementação do servidor
- Sistema de logs
- Banco de dados e implementações (repositories)
- Implementação dos serviços (token e crypt)
- Providenciação todas as dependencies da aplicação
- Montagem das endpoints (API REST com Maturidade 2) ligando com middlewares
- Implementação da camada de autenticação e autorização/permissão nas endpoints
