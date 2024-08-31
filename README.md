# Encurtador de Links
_Teste técnico para Teddy Open Finance_

Esse projeto é um sistema de encurtamento de Links, construído como uma API REST utilizando Node.js na versão 20. A aplicação segue os princípios de Maturidade 2 de uma API REST, segue um design de softwares baseado em Clean Arch + DDD.
A adoção do monorepo (por mais que há atualmente apenas um projeto) foi feita em planejamento para transformação em microsserviços no futuro, onde iria ser separado a parte de identificação dos usuários, regras e casos de usos dos links encurtados, etc. Mais para frente haverá informações melhores sobre possíveis melhorias.

## Visão Geral
O objetivo deste sistema é fornecer um serviço de encurtamento de Links que:
- Permite o cadastro e autenticação de usuários.
- Encurta URLs enviadas, retornando um link encurtado de no máximo 6 caracteres.
- Permite que usuários autenticados gerenciem seus URLs encurtados (listar, editar, excluir).
- Registra e contabiliza o número de acessos para cada URL encurtada.
- Garante a integridade dos registros com deletação lógica e rastreamento de modificações.

## Rodando a aplicação localmente

### Pré-requisitos
- Node.js na versão 20.x
- Yarn
- Docker (opcional, mas recomendado para rodar o banco de dados local em PostgresQL)

### Configuração e Execução

#### Passo a passo
1. Clone o repositório:
```bash
git clone https://github.com/felipstein/teddy-open-finance-challenge.git
```

2. Navegue para o diretório da aplicação api (chamada core):
```bash
cd teddy-open-finance-challenge/apps/core
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente conforme o necessário. Para cada variável, há uma breve descrição dentro do `.env.example`.

4. (opcional) Execute o docker-composer caso possua o docker-compose instalado:
```bash
docker-compose up
```

5. Instale as dependências com yarn:
```bash
yarn
```

6. Rode a aplicação em modo de desenvolvimento:
```bash
yarn dev
```

6.1 (opcional) Caso queire rodar em modo produção, rode o build e após isso, inicie com start:
```bash
yarn build
yarn start
```

#### Acesso à API

- A aplicação estará disponível na porta configurada no `.env`. O valor padrão é `3333`
- Documentação da API estará disponível em: `http://localhost:3333/docs`.

## Testes

Para rodar os testes automatizados, você pode configurar um `.env` a parte para ser utilizado nos testes, cujo nome deve ser `.env.test`.
Para rodar os testes, use:
```bash
yarn test
```

## Diagrama do Banco de Dados
O diagrama do banco de dados está disponível em docs/database/diagram.png.

## Ferramentas

O repositório está configurado com commitlint para o envio de commits padronizados e lint-staged para o fix do eslint antes de cada commit feito. Ambos configurados com husky.

## Possíveis melhorias

Infelizmente, pela falta de tempo para a realização do teste técnico, não consegui implementar tudo que queria (inclusive os diferenciais apresentados no teste). Mas meu objetivo no papel era transformar a aplicação em microsserviços, principalmente na parte de acessar os links encurtados. O acesso pelos links encurtados seria abstraído para uma Lambda Function da AWS, o que faria o papel muito rápido e barato do que a aplicação monolíta e, inclusive, não teria problemas CASO a aplicação estivesse fora do ar. A contabilização de acessos pelos link seria enviada para um sistema de fila (provavelmente o próprio SQS da AWS), na qual a aplicação core iria consumir essa fila quando estivesse disponível para contabilizar, formando uma comunicação assíncrona entre ambas as partes. Além de outros detalhes, como migrar sistema de identificação de usuários para um outro service, deploy automático com CodeBuild na AWS, gerenciamento de métricas e performance, etc.

## Changelog

Você pode acessar o changelog em [CHANGELOG.md](CHANGELOG.md)
