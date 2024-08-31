import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentação API',
      version: '0.1.1',
      description: 'Aplicação de encurtamento de Links para o teste Teddy Open Finance',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/:code': {
        get: {
          summary: 'Redireciona para o link original usando um código encurtado',
          parameters: [
            {
              name: 'code',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'Código do link encurtado',
            },
          ],
          responses: {
            '301': {
              description: 'Redireciona para o link original',
            },
            '410': {
              description: 'Link expirado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            '404': {
              description: 'Link não encontrado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/me': {
        get: {
          summary: 'Retorna dados do usuário autenticado',
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            '200': {
              description: 'Dados do usuário autenticado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                      email: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Não autenticado, sessão expirada ou sessão inválida',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            '404': {
              description: 'Cadastro não existe mais',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/auth/sign-up': {
        post: {
          summary: 'Cadastra um novo usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                    email: {
                      type: 'string',
                    },
                    password: {
                      type: 'string',
                    },
                  },
                  required: ['name', 'email', 'password'],
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Usuário cadastrado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      userId: {
                        type: 'string',
                      },
                      accessToken: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Campos faltando',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            '409': {
              description: 'Email já em uso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/auth/sign-in': {
        post: {
          summary: 'Faz login do usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                    },
                    password: {
                      type: 'string',
                    },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login bem-sucedido',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      userId: {
                        type: 'string',
                      },
                      accessToken: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Campos faltando',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            '403': {
              description: 'Credenciais inválidas',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/available/:code': {
        get: {
          summary:
            'Verifica se um código já está em uso (para melhoria de UX de aplicações client)',
          parameters: [
            {
              name: 'code',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'Código de link encurtado',
            },
          ],
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      available: {
                        type: 'boolean',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/links': {
        get: {
          summary: 'Retorna os links encurtados do usuário autenticado',
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      shortenedLinks: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                            code: {
                              type: 'string',
                            },
                            usageCount: {
                              type: 'number',
                            },
                            createdAt: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Não autenticado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Gera um novo link encurtado',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    link: {
                      type: 'string',
                    },
                    customCode: {
                      type: 'string',
                    },
                    expiresIn: {
                      type: 'string',
                    },
                  },
                  required: ['link'],
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Link encurtado gerado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      shortenedLinks: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                            code: {
                              type: 'string',
                            },
                            usageCount: {
                              type: 'number',
                            },
                            createdAt: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '409': {
              description: 'Código já em uso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/links/:id': {
        put: {
          summary: 'Atualiza dados de um link encurtado',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'ID do link encurtado',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    link: {
                      type: 'string',
                    },
                    customCode: {
                      type: 'string',
                    },
                    expiresIn: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '204': {
              description: 'Link atualizado',
            },
            '404': {
              description: 'Link não encontrado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            '409': {
              description: 'Código já em uso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: 'Deleta um link encurtado',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'ID do link encurtado',
            },
          ],
          responses: {
            '204': {
              description: 'Link deletado',
            },
            '404': {
              description: 'Link não encontrado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      causedBy: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
