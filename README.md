# Информационная система учета сотрудников факультета

Полнофункциональная информационная система для управления персоналом факультета с использованием Vue.js, Node.js и PostgreSQL.

## 🛠 Технологический стек

- **Frontend**: Vue.js 3, SCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Styling**: SCSS (Sass)

## 📊 Структура базы данных

Система содержит 5 основных сущностей:

1. **Departaments** (Факультеты) - структурные подразделения университета
2. **Employees** (Сотрудники) - персональная информация о сотрудниках
3. **Positions** (Должности) - справочник должностей
4. **Contracts** (Трудовые договоры) - договоры с сотрудниками
5. **EmploymentHistory** (История трудоустройства) - история трудовой деятельности

## 📄 Документация

- [Инфологическая модель](logical_model.md)
- [Физическая модель](physical_model.md)

## 🚀 Установка и запуск

### Требования

- Node.js (v14 или выше)
- PostgreSQL (v12 или выше)
- npm или yarn

### 1. Клонирование и настройка

```bash
# Клонировать репозиторий (если нужно)
cd crud-hopital
```

### 2. Настройка базы данных

```bash
# Подключиться к PostgreSQL
psql -U postgres

# Создать базу данных
CREATE DATABASE faculty_staff_db;

# Выйти из psql
\q

# Загрузить схему
psql -U postgres -d faculty_staff_db -f backend/database/schema.sql
```

### 3. Настройка Backend

```bash
# Перейти в директорию backend
cd backend

# Установить зависимости
npm install

# Создать файл .env (скопировать из .env.example)
# и заполнить данные для подключения к БД
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=faculty_staff_db
# DB_USER=postgres
# DB_PASSWORD=your_password

# Запустить backend
npm start
# или для разработки с автоперезагрузкой
npm run dev
```

Backend будет доступен на http://localhost:3000

### 4. Настройка Frontend

```bash
# Открыть новый терминал
# Перейти в директорию frontend
cd frontend

# Установить зависимости
npm install

# Запустить dev server
npm run serve
```

Frontend будет доступен на http://localhost:8080

## 📋 API Endpoints

### Факультеты
- `GET /api/departaments` - получить все факультеты
- `GET /api/departaments/:id` - получить факультет по ID
- `POST /api/departaments` - создать факультет
- `PUT /api/departaments/:id` - обновить факультет
- `DELETE /api/departaments/:id` - удалить факультет

### Сотрудники
- `GET /api/employees` - получить всех сотрудников
- `GET /api/employees/:id` - получить сотрудника по ID
- `POST /api/employees` - создать сотрудника
- `PUT /api/employees/:id` - обновить сотрудника
- `DELETE /api/employees/:id` - удалить сотрудника

### Должности
- `GET /api/positions` - получить все должности
- `GET /api/positions/:id` - получить должность по ID
- `POST /api/positions` - создать должность
- `PUT /api/positions/:id` - обновить должность
- `DELETE /api/positions/:id` - удалить должность

### Договоры
- `GET /api/contracts` - получить все договоры
- `GET /api/contracts/:id` - получить договор по ID
- `POST /api/contracts` - создать договор
- `PUT /api/contracts/:id` - обновить договор
- `DELETE /api/contracts/:id` - удалить договор

### Отчеты
- `GET /api/reports/employees-by-departament` - Отчет 1: Список сотрудников по факультетам
- `GET /api/reports/position-statistics` - Отчет 2: Статистика по должностям
- `GET /api/reports/employment-history/:employeeId` - Отчет 3: История трудоустройства сотрудника
- `GET /api/reports/active-contracts/:departamentId` - Отчет 4: Действующие договоры на факультете

## 📊 Отчеты

Система поддерживает 4 основных отчета:

1. **Список сотрудников по факультетам** - выводит всех сотрудников, сгруппированных по факультетам
2. **Статистика по должностям** - количество сотрудников, договоров и активных договоров по каждой должности
3. **История трудоустройства сотрудника** - полная история работы конкретного сотрудника
4. **Действующие договоры на факультете** - список активных договоров по выбранному факультету

## 🎨 Интерфейс

Современный и интуитивный интерфейс с использованием градиентов и адаптивного дизайна.

### Основные страницы:
- **Главная** - общая статистика и информация о системе
- **Факультеты** - управление факультетами
- **Сотрудники** - управление сотрудниками
- **Должности** - управление должностями
- **Договоры** - управление трудовыми договорами
- **Отчеты** - генерация и просмотр отчетов

## 📝 Функциональность

### CRUD операции
- Создание, чтение, обновление и удаление для всех сущностей
- Модальные окна для редактирования
- Валидация форм
- Подтверждение удаления

### Связи данных
- Foreign keys с каскадным удалением
- Целостность данных
- Автоматические timestamps

## 🗄 База данных

Схема базы данных включает:
- 5 основных таблиц
- Индексы для оптимизации запросов
- Триггеры для автоматического обновления `updated_at`
- Представления (views) для упрощения запросов
- Тестовые данные для демонстрации

## 🔒 Безопасность

- Валидация данных на уровне БД
- CORS настроен для безопасной работы с API
- Проверка типов данных
- Ограничения целостности данных

## 📦 Структура проекта

```
crud-hopital/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── departaments.js
│   │   ├── employees.js
│   │   ├── positions.js
│   │   ├── contracts.js
│   │   └── reports.js
│   ├── database/
│   │   └── schema.sql
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── styles/
│   │   │       └── main.scss
│   │   ├── components/
│   │   │   └── Modal.vue
│   │   ├── views/
│   │   │   ├── Home.vue
│   │   │   ├── Departaments.vue
│   │   │   ├── Employees.vue
│   │   │   ├── Positions.vue
│   │   │   ├── Contracts.vue
│   │   │   └── Reports.vue
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── store/
│   │   │   └── index.js
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
├── logical_model.md
├── physical_model.md
└── README.md
```

## 📝 Лицензия

ISC

## 👤 Автор

Faculty Staff Management System

