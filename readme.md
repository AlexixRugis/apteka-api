# API управления складами медикаментов

Для запуска сервера разработки:

```
npm install
npm run dev
```

Для авторизации необходимо передавать в headers ключ доступа apikey.

Формат хранения данных JSON.

# Конфигурация

При желании можно настроить порт, на котором работает сервер, и название файла бд (по умолчанию *db.sqlite3*) в файле *config/default.json*

# Как сбросить базу данных

В папке *data/* нужно удалить *db.sqlite3*, потом создать копию файла *db_clear_backup.sqlite3* и переименовать её в *db.sqlite3*

# Как добавить участника

Нужно в таблицу users добавить запись (например, через DBeaver). Поле apikey должно быть уникальным. После добавления нужно запусить команду:

```
npm run validate
```

Эта команда обновит базу и добавит остальные записи, необходимые для участника.
Последним шагом стоит запустить сервер и протыкать через swagger все post запросы, используя вышесозданный apikey.

# Предустановлено

В бекапе уже есть 15 настроенных участников, далее представлен список их ключей для работы с API:

- poetry_timetable
- green_side
- knowledge_conservation
- surface_breath
- audience_pair
- tycoon_analysis
- fast_earthquake
- compose_general
- twilight_dilute
- breeze_energy
- publication_sculpture
- agriculture_proposal
- reserve_slime
- colorful_generation
- blonde_fox
