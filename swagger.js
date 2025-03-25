const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HemoGraph API',
            version: '1.0.0',
            description: 'API para o sistema HemoGraph de gerenciamento de doações de sangue',
            contact: {
                name: 'Suporte HemoGraph',
                email: 'suporte@hemograph.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desenvolvimento'
            }
        ],
        components: {
            schemas: {
                Doador: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID único do doador'
                        },
                        nome: {
                            type: 'string',
                            description: 'Nome completo do doador'
                        },
                        tipo_sanguineo: {
                            type: 'string',
                            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
                            description: 'Tipo sanguíneo do doador'
                        },
                        data_nascimento: {
                            type: 'string',
                            format: 'date',
                            description: 'Data de nascimento do doador'
                        },
                        peso: {
                            type: 'number',
                            description: 'Peso do doador em kg'
                        },
                        contato: {
                            type: 'string',
                            description: 'Contato do doador (telefone ou email)'
                        },
                        cidade: {
                            type: 'string',
                            description: 'Cidade do doador'
                        },
                        estado: {
                            type: 'string',
                            description: 'Estado do doador'
                        },
                        ultima_doacao: {
                            type: 'string',
                            format: 'date',
                            description: 'Data da última doação'
                        },
                        ultimo_banco: {
                            type: 'string',
                            description: 'Nome do último banco de sangue onde doou'
                        }
                    },
                    required: ['nome', 'tipo_sanguineo', 'data_nascimento', 'peso', 'contato', 'cidade', 'estado']
                },
                BancoSangue: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID único do banco de sangue'
                        },
                        nome_organizacao: {
                            type: 'string',
                            description: 'Nome da organização'
                        },
                        cep: {
                            type: 'string',
                            description: 'CEP do endereço'
                        },
                        cidade: {
                            type: 'string',
                            description: 'Cidade do banco'
                        },
                        estado: {
                            type: 'string',
                            description: 'Estado do banco (UF)'
                        },
                        rua: {
                            type: 'string',
                            description: 'Rua do endereço'
                        },
                        numero: {
                            type: 'string',
                            description: 'Número do endereço'
                        },
                        bairro: {
                            type: 'string',
                            description: 'Bairro do endereço'
                        },
                        responsavel: {
                            type: 'string',
                            description: 'Nome do responsável'
                        },
                        contato: {
                            type: 'string',
                            description: 'Telefone de contato'
                        },
                        site: {
                            type: 'string',
                            description: 'Site da organização'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email do banco'
                        },
                        cnpj: {
                            type: 'string',
                            description: 'CNPJ do banco'
                        },
                        razao_social: {
                            type: 'string',
                            description: 'Razão social'
                        },
                        ativo: {
                            type: 'boolean',
                            description: 'Status de ativação do banco'
                        }
                    }
                },
                NecessidadeSangue: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID único da necessidade'
                        },
                        banco_sangue_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID do banco de sangue'
                        },
                        tipo_sanguineo: {
                            type: 'string',
                            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
                            description: 'Tipo sanguíneo necessário'
                        },
                        nivel_urgencia: {
                            type: 'string',
                            enum: ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'],
                            description: 'Nível de urgência da necessidade'
                        },
                        quantidade_necessaria: {
                            type: 'integer',
                            description: 'Quantidade de bolsas necessárias'
                        },
                        data_limite: {
                            type: 'string',
                            format: 'date',
                            description: 'Data limite para doação'
                        },
                        status: {
                            type: 'string',
                            enum: ['ATIVA', 'ATENDIDA', 'EXPIRADA'],
                            description: 'Status atual da necessidade'
                        },
                        observacoes: {
                            type: 'string',
                            description: 'Observações adicionais'
                        }
                    }
                }
            }
        },
        paths: {
            '/auth/login': {
                post: {
                    tags: ['Autenticação'],
                    summary: 'Login de usuário',
                    description: 'Autentica um usuário (doador ou banco) no sistema',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'senha', 'tipo'],
                                    properties: {
                                        email: {
                                            type: 'string',
                                            format: 'email'
                                        },
                                        senha: {
                                            type: 'string'
                                        },
                                        tipo: {
                                            type: 'string',
                                            enum: ['doador', 'banco']
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Login realizado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            token: {
                                                type: 'string',
                                                description: 'Token JWT para autenticação'
                                            },
                                            usuario: {
                                                type: 'object',
                                                description: 'Dados do usuário autenticado'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            description: 'Credenciais inválidas'
                        }
                    }
                }
            },
            '/doadores/registro': {
                post: {
                    tags: ['Doadores'],
                    summary: 'Registrar novo doador',
                    description: 'Cria um novo registro de doador no sistema',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: [
                                        'nome',
                                        'tipo_sanguineo',
                                        'data_nascimento',
                                        'peso',
                                        'contato',
                                        'cep',
                                        'cidade',
                                        'estado',
                                        'rua',
                                        'numero',
                                        'bairro',
                                        'email',
                                        'senha'
                                    ],
                                    properties: {
                                        nome: { 
                                            type: 'string',
                                            description: 'Nome completo do doador'
                                        },
                                        tipo_sanguineo: {
                                            type: 'string',
                                            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
                                            description: 'Tipo sanguíneo do doador'
                                        },
                                        data_nascimento: {
                                            type: 'string',
                                            format: 'date',
                                            description: 'Data de nascimento do doador'
                                        },
                                        peso: { 
                                            type: 'number',
                                            description: 'Peso do doador em kg'
                                        },
                                        contato: { 
                                            type: 'string',
                                            description: 'Número de telefone do doador'
                                        },
                                        cep: { 
                                            type: 'string',
                                            description: 'CEP do endereço'
                                        },
                                        cidade: { 
                                            type: 'string',
                                            description: 'Cidade do doador'
                                        },
                                        estado: { 
                                            type: 'string',
                                            description: 'Estado do doador (UF)'
                                        },
                                        rua: { 
                                            type: 'string',
                                            description: 'Rua do endereço'
                                        },
                                        numero: { 
                                            type: 'string',
                                            description: 'Número do endereço'
                                        },
                                        bairro: { 
                                            type: 'string',
                                            description: 'Bairro do endereço'
                                        },
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                            description: 'Email do doador'
                                        },
                                        senha: {
                                            type: 'string',
                                            format: 'password',
                                            description: 'Senha para acesso'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Doador registrado com sucesso'
                        },
                        400: {
                            description: 'Email já cadastrado'
                        },
                        500: {
                            description: 'Erro ao registrar doador'
                        }
                    }
                }
            },
            '/doadores/listar': {
                get: {
                    tags: ['Doadores'],
                    summary: 'Listar todos os doadores',
                    description: 'Retorna uma lista de todos os doadores cadastrados',
                    responses: {
                        200: {
                            description: 'Lista de doadores retornada com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            doadores: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/Doador'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Erro ao listar doadores'
                        }
                    }
                }
            },
            '/doadores/tipo/{tipo_sanguineo}': {
                get: {
                    tags: ['Doadores'],
                    summary: 'Buscar doadores por tipo sanguíneo',
                    description: 'Retorna uma lista de doadores filtrados por tipo sanguíneo',
                    parameters: [
                        {
                            in: 'path',
                            name: 'tipo_sanguineo',
                            required: true,
                            schema: {
                                type: 'string',
                                enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
                            },
                            description: 'Tipo sanguíneo para filtrar'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Lista de doadores retornada com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            doadores: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/Doador'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Erro ao buscar doadores'
                        }
                    }
                }
            },
            '/necessidades-sangue/registro': {
                post: {
                    tags: ['Necessidades de Sangue'],
                    summary: 'Registrar nova necessidade de sangue',
                    description: 'Cria um novo registro de necessidade de sangue',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/NecessidadeSangue'
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Necessidade registrada com sucesso'
                        },
                        400: {
                            description: 'Dados inválidos'
                        },
                        401: {
                            description: 'Não autorizado'
                        },
                        500: {
                            description: 'Erro ao registrar necessidade'
                        }
                    }
                }
            },
            '/necessidades-sangue': {
                get: {
                    tags: ['Necessidades de Sangue'],
                    summary: 'Listar todas as necessidades de sangue',
                    description: 'Retorna uma lista de todas as necessidades de sangue ativas',
                    responses: {
                        200: {
                            description: 'Lista de necessidades retornada com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/NecessidadeSangue'
                                        }
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Erro ao listar necessidades'
                        }
                    }
                }
            },
            '/necessidades-sangue/tipo/{tipo_sanguineo}': {
                get: {
                    tags: ['Necessidades de Sangue'],
                    summary: 'Buscar necessidades por tipo sanguíneo',
                    description: 'Retorna uma lista de necessidades de sangue filtradas por tipo sanguíneo',
                    parameters: [
                        {
                            in: 'path',
                            name: 'tipo_sanguineo',
                            required: true,
                            schema: {
                                type: 'string',
                                enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
                            },
                            description: 'Tipo sanguíneo para filtrar'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Lista de necessidades retornada com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/NecessidadeSangue'
                                        }
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Erro ao buscar necessidades'
                        }
                    }
                }
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "HemoGraph API Documentation",
        customfavIcon: "/favicon.ico"
    }));
}; 