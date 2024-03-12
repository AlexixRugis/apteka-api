module.exports = {
    openapi: '3.0.0',
    info: {
      title: 'API аптека',
      description: 'API для управления складами медикаментов.',
      version: '1.0.0',
    },
    paths: {
        "/api/warehouses": {
            get: {
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    }
                ],
                description: "Получить массив доступных складов.",
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: {
                                type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                description: "id склада.",
                                                type: "integer",
                                                example: 0
                                            },
                                            name: {
                                                description: "Название склада.",
                                                type: "string",
                                                example: "Склад 1"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        description: "Ключ API не был предоставлен"
                    },
                    "501": {
                        description: "Непредвиденная ошибка сервера"
                    }
                }
            }
        },

        "/api/medicines": {
            get: {
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    },
                    {
                        in: "query",
                        name: "warehouseId",
                        type: "integer",
                        description: "Id склада, по которому производится поиск (оставьте пустым, если нужен поиск по всем складам"
                    }
                ],
                description: "Получить массив доступных медикаментов.",
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: {
                                type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            product_id: {
                                                description: "id медикамента.",
                                                type: "integer",
                                                example: 1
                                            },
                                            warehouse_id: {
                                                description: "id склада.",
                                                type: "integer",
                                                example: 3
                                            },
                                            quantity: {
                                                description: "Количество на складе.",
                                                type: "integer",
                                                example: 10
                                            },
                                            name: {
                                                description: "Название медикамента.",
                                                type: "string",
                                                example: "Вольтарен 25мг/мл 3мл 5 шт. раствор для внутримышечного введения"
                                            },
                                            tradename: {
                                                description: "Торговая марка.",
                                                type: "string",
                                                example: "Вольтарен"
                                            },
                                            manufacturer: {
                                                description: "Производитель.",
                                                type: "string",
                                                example: "Новартис Фарма АГ"
                                            },
                                            image: {
                                                description: "Путь к изображению (относительный URL на сервере).",
                                                type: "string",
                                                example: "images/voltaren.jpg"
                                            },
                                            price: {
                                                description: "Цена товара.",
                                                type: "integer",
                                                example: "79"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        description: "Ключ API не был предоставлен"
                    },
                    "501": {
                        description: "Непредвиденная ошибка сервера"
                    }
                }
            }
        },

        "/api/medicines/running_out": {
            get: {
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    }
                ],
                description: "Получить массив доступных медикаментов.",
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: {
                                type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            product_id: {
                                                description: "id медикамента.",
                                                type: "integer",
                                                example: 1
                                            },
                                            warehouse_id: {
                                                description: "id склада.",
                                                type: "integer",
                                                example: 3
                                            },
                                            quantity: {
                                                description: "Количество на складе.",
                                                type: "integer",
                                                example: 10
                                            },
                                            name: {
                                                description: "Название медикамента.",
                                                type: "string",
                                                example: "Вольтарен 25мг/мл 3мл 5 шт. раствор для внутримышечного введения"
                                            },
                                            tradename: {
                                                description: "Торговая марка.",
                                                type: "string",
                                                example: "Вольтарен"
                                            },
                                            manufacturer: {
                                                description: "Производитель.",
                                                type: "string",
                                                example: "Новартис Фарма АГ"
                                            },
                                            image: {
                                                description: "Путь к изображению (относительный URL на сервере).",
                                                type: "string",
                                                example: "images/voltaren.jpg"
                                            },
                                            price: {
                                                description: "Цена товара.",
                                                type: "integer",
                                                example: "79"
                                            },
                                            optimal_quantity: {
                                                description: "Оптимальное количество на складе.",
                                                type: "integer",
                                                example: "10"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        description: "Ключ API не был предоставлен"
                    },
                    "501": {
                        description: "Непредвиденная ошибка сервера"
                    }
                }
            }
        },

        "/api/medicines/writeoff": {
            get: {
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    },
                ],
                description: "Получить массив доступных медикаментов.",
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: {
                                type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                description: "id операции списания",
                                                type: "integer",
                                                example: 1
                                            },
                                            product_id: {
                                                description: "id медикамента",
                                                type: "integer",
                                                example: 1
                                            },
                                            createdTime: {
                                                description: "Дата списания",
                                                type: "string",
                                                format: "date",
                                                example: "2024-03-12T14:31:58.019Z"
                                            },
                                            quantity: {
                                                description: "Списанное количество",
                                                type: "integer",
                                                example: 10
                                            },
                                            reason: {
                                                description: "",
                                                type: "string",
                                                example: "просрочено"
                                            },
                                            name: {
                                                description: "Название медикамента.",
                                                type: "string",
                                                example: "Вольтарен 25мг/мл 3мл 5 шт. раствор для внутримышечного введения"
                                            },
                                            tradename: {
                                                description: "Торговая марка.",
                                                type: "string",
                                                example: "Вольтарен"
                                            },
                                            manufacturer: {
                                                description: "Производитель.",
                                                type: "string",
                                                example: "Новартис Фарма АГ"
                                            },
                                            image: {
                                                description: "Путь к изображению (относительный URL на сервере).",
                                                type: "string",
                                                example: "images/voltaren.jpg"
                                            },
                                            price: {
                                                description: "Цена товара.",
                                                type: "integer",
                                                example: "79"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        description: "Ключ API не был предоставлен"
                    },
                    "501": {
                        description: "Непредвиденная ошибка сервера"
                    }
                }
            },
            post: {
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    },
                ],
                description: "Списать медикаменты со склада. Заявленные препараты будут изъяты со склада.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    medicine_id: {
                                        description: "id медикамента",
                                        type: "integer",
                                        example: 1,
                                        required: true
                                    },
                                    quantity: {
                                        description: "Количество, которое нужно списать",
                                        type: "integer",
                                        min: 1,
                                        example: 5,
                                        required: true
                                    },
                                    reason: {
                                        description: "Причина списания",
                                        type: "string",
                                        min: 1, 
                                        max: 120,
                                        example: "просрочено",
                                        required: true
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "404": {
                        description: "Медикамент не найден"
                    },
                    "401": {
                        description: "Неверный ключ API"
                    },
                    "500": {
                        description: "Ошибка сервера"
                    },
                    "400": {
                        description: "Предоставлены неверные данные (неверный формат или на складе недостаточно медикаментов для списания)"
                    },
                    "200": {
                        description: "Запрос выполнен успешно"
                    }
                }
            }
        },

        "/api/medicines/issues": {
            get: {
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    },
                ],
                description: "Получить все заказы препаратов",
                responses: {
                    "200": {
                        description: "Запрос выполнен успешно",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                description: "id заказа",
                                                type: "integer",
                                                example: 1
                                            },
                                            purpose: {
                                                description: "Назначение заказа",
                                                type: "string",
                                                example: "Хирургическое отделение городской больницы"
                                            },
                                            completed: {
                                                description: "Завершен ли заказ (0-нет, 1-да)",
                                                type: "integer",
                                                example: 1
                                            },
                                            createdTime: {
                                                description: "Дата создания заказа",
                                                type: "string",
                                                format: "date",
                                                example: "2024-03-12T14:12:43.594Z"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        description: "Ошибка сервера"
                    },
                    "401": {
                        description: "Неверный ключ API"
                    }
                }
            },
            post: {
                description: "Создать новый заказ препаратов. Заявленные препараты будут изъяты со склада.",
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    purpose: {
                                        type: "string",
                                        min: 1,
                                        max: 120,
                                        required: true,
                                        example: "Хирургическое отделение городской больницы"
                                    },
                                    items: {
                                        type: "array",
                                        min: 1,
                                        items: {
                                            type: "object",
                                            properties: {
                                                medicine_id: {
                                                    type: "integer",
                                                    required: true,
                                                    example: 1
                                                },
                                                quantity: {
                                                    type: "integer",
                                                    min: 1,
                                                    required: true,
                                                    example: 5
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "404": {
                        description: "Медикамент не найден"
                    },
                    "401": {
                        description: "Неверный ключ API"
                    },
                    "500": {
                        description: "Ошибка сервера"
                    },
                    "400": {
                        description: "Предоставлены неверные данные (неверный формат, или id медикаментов повторяются, или недостаточно медикаментов на складе)"
                    },
                    "200": {
                        description: "Запрос выполнен успешно"
                    }
                }
            }
        },

        "/api/medicines/issues/{issue_id}/complete": {
            put: {
                description: "Завершить заказ",
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    },
                    {
                        in: "path",
                        name: "issue_id",
                        type: "integer",
                        required: true,
                        description: "id заказа",
                        example: 1
                    }
                ],
                responses: {
                    "200": {
                        description: "Запрос выполнен успешно"
                    },
                    "400": {
                        description: "Заказ уже завершён"
                    },
                    "404": {
                        description: "Заказ с таким issue_id не найден"
                    },
                    "401": {
                        description: "Неверный ключ API"
                    },
                    "500": {
                        description: "Ошибка сервера"
                    }
                }
            }
        },

        "/api/medicines/issues/{issue_id}": {
            get: {
                description: "Получить информацию о заказе",
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    },
                    {
                        in: "path",
                        name: "issue_id",
                        type: "integer",
                        required: true,
                        description: "id заказа",
                        example: 1
                    }
                ],
                responses: {
                    "200": {
                        description: "Запрос выполнен успешно",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                        properties: {
                                            id: {
                                                description: "id заказа",
                                                type: "integer",
                                                example: 1
                                            },
                                            purpose: {
                                                description: "Назначение заказа",
                                                type: "string",
                                                example: "Хирургическое отделение городской больницы"
                                            },
                                            completed: {
                                                description: "Завершен ли заказ (0-нет, 1-да)",
                                                type: "integer",
                                                example: 1
                                            },
                                            createdTime: {
                                                description: "Дата создания заказа",
                                                type: "string",
                                                format: "date",
                                                example: "2024-03-12T14:12:43.594Z"
                                            },
                                            items: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        product_id: {
                                                            description: "id медикамента",
                                                            type: "integer",
                                                            example: 1
                                                        },
                                                        quantity: {
                                                            description: "Количество товара",
                                                            type: "integer",
                                                            example: 20
                                                        },
                                                        name: {
                                                            description: "Название медикамента",
                                                            type: "string",
                                                            example: "Вольтарен 25мг/мл 3мл 5 шт. раствор для внутримышечного введения"
                                                        },
                                                        tradename: {
                                                            description: "Торговая марка",
                                                            type: "string",
                                                            example: "Вольтарен"
                                                        },
                                                        manufacturer: {
                                                            description: "Производитель",
                                                            type: "string",
                                                            example: "Новартис Фарма АГ"
                                                        },
                                                        image: {
                                                            description: "Путь к изображению (относительный URL на сервере)",
                                                            type: "string",
                                                            example: "images/voltaren.jpg"
                                                        },
                                                        price: {
                                                            description: "Цена товара",
                                                            type: "integer",
                                                            example: 79
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                }
                            }
                        }
                    },
                    "404": {
                        description: "Заказ с таким issue_id не найден"
                    },
                    "401": {
                        description: "Неверный ключ API"
                    },
                    "500": {
                        description: "Ошибка сервера"
                    }
                }
            }
        },

        "/api/medicines/invoices": {
            get: {
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    },
                ],
                description: "Получить список поставок препаратов",
                responses: {
                    "200": {
                        description: "Запрос выполнен успешно",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                description: "id поставки",
                                                type: "integer",
                                                example: 1
                                            },
                                            provider: {
                                                description: "Поставщик",
                                                type: "string",
                                                example: "Поставщик N1"
                                            },
                                            createdTime: {
                                                description: "Дата поставки",
                                                type: "string",
                                                format: "date",
                                                example: "2024-01-01"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        description: "Ошибка сервера"
                    },
                    "401": {
                        description: "Неверный ключ API"
                    }
                }
            },
            post: {
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    },
                ],
                description: "Добавить информацию о поставке товаров",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    document_date: {
                                        description: "Дата поставки",
                                        type: "string",
                                        format: "date",
                                        required: true,
                                        example: "2024-01-01"
                                    },
                                    provider: {
                                        description: "Поставщик",
                                        type: "string",
                                        min: 1,
                                        max: 120,
                                        required: true,
                                        example: "Поставщик N1"
                                    },
                                    items: {
                                        type: "array",
                                        min: 1,
                                        items: {
                                            type: "object",
                                            properties: {
                                                medicine_id: {
                                                    description: "id медикамента",
                                                    type: "integer",
                                                    required: true,
                                                    example: 1
                                                },
                                                price: {
                                                    description: "Цена доставки медикамента",
                                                    type: "integer",
                                                    min: 1,
                                                    required: true,
                                                    example: 40
                                                },
                                                quantity: {
                                                    description: "Количество доставляемых медикаментов",
                                                    type: "integer",
                                                    min: 1,
                                                    required: true,
                                                    example: 20
                                                },
                                                expiration_date: {
                                                    description: "Срок годности медикаментов",
                                                    type: "string",
                                                    format: "date",
                                                    required: true,
                                                    example: "2027-01-01"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "404": {
                        description: "Медикамент не найден"
                    },
                    "401": {
                        description: "Неверный ключ API"
                    },
                    "500": {
                        description: "Ошибка сервера"
                    },
                    "400": {
                        description: "Предоставлены неверные данные (неверный формат, или id медикаментов повторяются, или медикаменты просрочены)"
                    },
                    "200": {
                        description: "Запрос выполнен успешно"
                    }
                }
            }
        },

        "/api/medicines/invoices/{invoice_id}": {
            get: {
                description: "Получить информацию о поставке",
                parameters: [
                    {
                        in: "header",
                        name: "apikey",
                        type: "string",
                        required: true,
                        description: "Ключ доступа к API"
                    },
                    {
                        in: "path",
                        name: "invoice_id",
                        type: "integer",
                        required: true,
                        description: "id поставки",
                        example: 1
                    }
                ],
                responses: {
                    "200": {
                        description: "Запрос выполнен успешно",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            description: "id поставки",
                                            type: "integer",
                                            example: 1
                                        },
                                        provider: {
                                            description: "Поставщик",
                                            type: "string",
                                            example: "Поставщик N1"
                                        },
                                        createdTime: {
                                            description: "Дата поставки",
                                            type: "string",
                                            format: "date",
                                            example: "2024-01-01"
                                        },
                                        items: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    product_id: {
                                                        description: "id медикамента",
                                                        type: "integer",
                                                        example: 1
                                                    },
                                                    price: {
                                                        description: "Цена товара",
                                                        type: "integer",
                                                        example: 79
                                                    },
                                                    quantity: {
                                                        description: "Количество товара",
                                                        type: "integer",
                                                        example: 20
                                                    },
                                                    expiration_date: {
                                                        description: "Срок годности",
                                                        type: "string",
                                                        format: "date",
                                                        example: "2027-01-01"
                                                    },
                                                    name: {
                                                        description: "Название медикамента",
                                                        type: "string",
                                                        example: "Вольтарен 25мг/мл 3мл 5 шт. раствор для внутримышечного введения"
                                                    },
                                                    tradename: {
                                                        description: "Торговая марка",
                                                        type: "string",
                                                        example: "Вольтарен"
                                                    },
                                                    manufacturer: {
                                                        description: "Производитель",
                                                        type: "string",
                                                        example: "Новартис Фарма АГ"
                                                    },
                                                    image: {
                                                        description: "Путь к изображению (относительный URL на сервере)",
                                                        type: "string",
                                                        example: "images/voltaren.jpg"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        description: "Поставка с таким invoice_id не найдена"
                    },
                    "401": {
                        description: "Неверный ключ API"
                    },
                    "500": {
                        description: "Ошибка сервера"
                    }
                }
            }
        }
    }
};