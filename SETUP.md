# Руководство по установке

## Шаг 1: Установка PostgreSQL

Убедитесь, что PostgreSQL установлен и запущен на вашей системе.

## Шаг 2: Создание базы данных

Откройте терминал и выполните следующие команды:

```bash
# Подключиться к PostgreSQL
psql -U postgres

# Создать базу данных
CREATE DATABASE faculty_staff_db;

# Выйти
\q
```

## Шаг 3: Загрузка схемы базы данных

```bash
psql -U postgres -d faculty_staff_db -f backend/database/schema.sql
```

## Шаг 4: Настройка Backend

```bash
cd backend
npm install

# Создать файл .env в папке backend
# Windows:
copy public\.env.example .env
# Linux/Mac:
cp public/.env.example .env

# Отредактировать .env и установить ваш пароль от PostgreSQL
# DB_PASSWORD=your_postgres_password

npm start
```

Backend будет доступен на http://localhost:3000

## Шаг 5: Настройка Frontend

```bash
cd frontend
npm install
npm run serve
```

Frontend будет доступен на http://localhost:8080

## Проверка работы

1. Откройте браузер на http://localhost:8080
2. Вы должны увидеть главную страницу с статистикой
3. Используйте навигационное меню для доступа к различным модулям

## Тестовые данные

Система автоматически загружает тестовые данные из `backend/database/schema.sql`:
- 3 факультета
- 5 должностей
- 4 сотрудника
- 4 договора
- История трудоустройства

