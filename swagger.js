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
        }
    }
};