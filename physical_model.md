# Физическая модель базы данных
## PostgreSQL

### Стратегия реализации физических структур

## 1. ТАБЛИЦА: Departaments (Факультеты)

```sql
CREATE TABLE Departaments (
    departament_id SERIAL PRIMARY KEY,
    departament_name VARCHAR(150) NOT NULL UNIQUE,
    building_address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_departament_name ON Departaments(departament_name);
CREATE UNIQUE INDEX idx_departament_email ON Departaments(email);
```

**Ограничения:**
- `departament_name` - NOT NULL, UNIQUE
- `email` - формат email
- Автоматические timestamps для аудита

## 2. ТАБЛИЦА: Positions (Должности)

```sql
CREATE TABLE Positions (
    position_id SERIAL PRIMARY KEY,
    position_name VARCHAR(150) NOT NULL UNIQUE,
    salary_range VARCHAR(50),
    responsibilities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_position_name ON Positions(position_name);
```

**Ограничения:**
- `position_name` - NOT NULL, UNIQUE
- Дополнительные проверки на валидность диапазона зарплат

## 3. ТАБЛИЦА: Employees (Сотрудники)

```sql
CREATE TABLE Employees (
    employee_id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    birth_date DATE NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    education VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_employee_last_name ON Employees(last_name);
CREATE INDEX idx_employee_email ON Employees(email);
CREATE INDEX idx_employee_full_name ON Employees(last_name, first_name, middle_name);
```

**Ограничения:**
- `last_name`, `first_name`, `birth_date` - NOT NULL
- `email` - UNIQUE
- Проверка даты рождения (не в будущем)
- Проверка возраста (>= 16 лет)

## 4. ТАБЛИЦА: Contracts (Трудовые договоры)

```sql
CREATE TABLE Contracts (
    contract_id SERIAL PRIMARY KEY,
    contract_number VARCHAR(50) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE,
    contract_type VARCHAR(50) NOT NULL,
    employee_id INTEGER NOT NULL REFERENCES Employees(employee_id) ON DELETE CASCADE,
    departament_id INTEGER NOT NULL REFERENCES Departaments(departament_id) ON DELETE RESTRICT,
    position_id INTEGER NOT NULL REFERENCES Positions(position_id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date IS NULL OR end_date >= start_date),
    CHECK (contract_type IN ('основной', 'по совместительству', 'временный'))
);

-- Индексы
CREATE INDEX idx_contract_employee ON Contracts(employee_id);
CREATE INDEX idx_contract_departament ON Contracts(departament_id);
CREATE INDEX idx_contract_position ON Contracts(position_id);
CREATE INDEX idx_contract_dates ON Contracts(start_date, end_date);
CREATE INDEX idx_contract_type ON Contracts(contract_type);
```

**Ограничения:**
- `contract_number` - NOT NULL, UNIQUE
- Проверка дат: end_date >= start_date
- Проверка типа договора
- Foreign keys с CASCADE/RESTRICT стратегиями

## 5. ТАБЛИЦА: EmploymentHistory (История трудоустройства)

```sql
CREATE TABLE EmploymentHistory (
    history_id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES Employees(employee_id) ON DELETE CASCADE,
    departament_id INTEGER NOT NULL REFERENCES Departaments(departament_id) ON DELETE RESTRICT,
    position_id INTEGER NOT NULL REFERENCES Positions(position_id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'работает',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date IS NULL OR end_date >= start_date),
    CHECK (status IN ('работает', 'уволен', 'в отпуске', 'на больничном'))
);

-- Индексы
CREATE INDEX idx_history_employee ON EmploymentHistory(employee_id);
CREATE INDEX idx_history_departament ON EmploymentHistory(departament_id);
CREATE INDEX idx_history_position ON EmploymentHistory(position_id);
CREATE INDEX idx_history_dates ON EmploymentHistory(start_date, end_date);
CREATE INDEX idx_history_status ON EmploymentHistory(status);
CREATE INDEX idx_history_dates_range ON EmploymentHistory USING GIST (tstzrange(start_date, end_date));
```

**Ограничения:**
- Проверка дат: end_date >= start_date
- Проверка статуса
- GIST индекс для эффективных запросов по диапазонам дат

## Связи (Foreign Keys)

### Relationships Overview:
1. **Contracts.employee_id** → Employees.employee_id (CASCADE)
2. **Contracts.departament_id** → Departaments.departament_id (RESTRICT)
3. **Contracts.position_id** → Positions.position_id (RESTRICT)
4. **EmploymentHistory.employee_id** → Employees.employee_id (CASCADE)
5. **EmploymentHistory.departament_id** → Departaments.departament_id (RESTRICT)
6. **EmploymentHistory.position_id** → Positions.position_id (RESTRICT)

## Дополнительные объекты БД

### Триггеры для автоматического обновления updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Применяем триггер к каждой таблице
CREATE TRIGGER update_departaments_updated_at 
    BEFORE UPDATE ON Departaments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at 
    BEFORE UPDATE ON Positions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON Employees 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at 
    BEFORE UPDATE ON Contracts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employment_history_updated_at 
    BEFORE UPDATE ON EmploymentHistory 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Представления (Views) для отчетов

```sql
-- View для активных договоров
CREATE VIEW active_contracts AS
SELECT 
    c.contract_id,
    c.contract_number,
    e.last_name || ' ' || e.first_name || ' ' || COALESCE(e.middle_name, '') AS employee_full_name,
    d.departament_name,
    p.position_name,
    c.contract_type,
    c.start_date,
    c.end_date
FROM Contracts c
JOIN Employees e ON c.employee_id = e.employee_id
JOIN Departaments d ON c.departament_id = d.departament_id
JOIN Positions p ON c.position_id = p.position_id
WHERE c.end_date IS NULL OR c.end_date >= CURRENT_DATE;

-- View для статистики по должностям
CREATE VIEW position_statistics AS
SELECT 
    p.position_id,
    p.position_name,
    p.salary_range,
    COUNT(DISTINCT c.employee_id) AS employee_count,
    COUNT(c.contract_id) AS contract_count,
    COUNT(CASE WHEN c.end_date IS NULL OR c.end_date >= CURRENT_DATE THEN 1 END) AS active_contracts
FROM Positions p
LEFT JOIN Contracts c ON p.position_id = c.position_id
GROUP BY p.position_id, p.position_name, p.salary_range;
```

### Типы данных и оптимизация

1. **SERIAL** - для автоинкрементных ID (INTEGER с последовательностью)
2. **VARCHAR(n)** - с ограничением длины для оптимизации
3. **DATE** - для дат без времени
4. **TIMESTAMP** - для временных меток с точностью
5. **TEXT** - для больших текстовых полей
6. **CHECK constraints** - для проверки данных
7. **Composite индексы** - для частых совместных запросов
8. **GIST индекс** - для эффективных запросов по диапазонам дат

### Стратегии хранения
- Использование нормализованных структур
- Индексы для ускорения поиска
- Ограничения целостности для надежности данных
- Аудит через created_at/updated_at поля
- Представления для упрощения сложных запросов

