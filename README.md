## Instalação e execução

**Faça um clone desse repositório**

Na root do projeto:

- Execute o comando `make up` ou `docker-compose up` para rodar a aplicação com Docker;
- A API iniciará na sua rede local, as portas padrões utilizadas são :8090 para o back-end e :80 para o front-end

**O front-end encontra-se inacabado**

## Testes automatizados

### Back-end

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

> Foram feitos apenas alguns testes unitários, conforme especificado no teste.
