-- Информационная система учета сотрудников факультета
-- База данных PostgreSQL

-- Удаление существующих объектов (для пересоздания БД)
DROP TABLE IF EXISTS EmploymentHistory CASCADE;
DROP TABLE IF EXISTS Contracts CASCADE;
DROP TABLE IF EXISTS Employees CASCADE;
DROP TABLE IF EXISTS Positions CASCADE;
DROP TABLE IF EXISTS Departaments CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 1. ТАБЛИЦА: Departaments (Факультеты)
CREATE TABLE Departaments (
    departament_id SERIAL PRIMARY KEY,
    departament_name VARCHAR(150) NOT NULL UNIQUE,
    building_address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_departament_name ON Departaments(departament_name);
CREATE UNIQUE INDEX idx_departament_email ON Departaments(email);

-- 2. ТАБЛИЦА: Positions (Должности)
CREATE TABLE Positions (
    position_id SERIAL PRIMARY KEY,
    position_name VARCHAR(150) NOT NULL UNIQUE,
    salary_range VARCHAR(50),
    responsibilities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_position_name ON Positions(position_name);

-- 3. ТАБЛИЦА: Employees (Сотрудники)
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

CREATE INDEX idx_employee_last_name ON Employees(last_name);
CREATE INDEX idx_employee_email ON Employees(email);
CREATE INDEX idx_employee_full_name ON Employees(last_name, first_name, middle_name);

-- 4. ТАБЛИЦА: Contracts (Трудовые договоры)
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

CREATE INDEX idx_contract_employee ON Contracts(employee_id);
CREATE INDEX idx_contract_departament ON Contracts(departament_id);
CREATE INDEX idx_contract_position ON Contracts(position_id);
CREATE INDEX idx_contract_dates ON Contracts(start_date, end_date);
CREATE INDEX idx_contract_type ON Contracts(contract_type);

-- 5. ТАБЛИЦА: EmploymentHistory (История трудоустройства)
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

CREATE INDEX idx_history_employee ON EmploymentHistory(employee_id);
CREATE INDEX idx_history_departament ON EmploymentHistory(departament_id);
CREATE INDEX idx_history_position ON EmploymentHistory(position_id);
CREATE INDEX idx_history_dates ON EmploymentHistory(start_date, end_date);
CREATE INDEX idx_history_status ON EmploymentHistory(status);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
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

-- Представления для отчетов
CREATE OR REPLACE VIEW active_contracts AS
SELECT 
    c.contract_id,
    c.contract_number,
    e.employee_id,
    e.last_name || ' ' || e.first_name || ' ' || COALESCE(e.middle_name, '') AS employee_full_name,
    d.departament_id,
    d.departament_name,
    p.position_id,
    p.position_name,
    c.contract_type,
    c.start_date,
    c.end_date
FROM Contracts c
JOIN Employees e ON c.employee_id = e.employee_id
JOIN Departaments d ON c.departament_id = d.departament_id
JOIN Positions p ON c.position_id = p.position_id
WHERE c.end_date IS NULL OR c.end_date >= CURRENT_DATE;

CREATE OR REPLACE VIEW position_statistics AS
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

-- Тестовые данные
INSERT INTO Departaments (departament_name, building_address, phone, email) VALUES
('Факультет информатики', 'ул. Университетская, 1, корпус А', '+7 (495) 123-45-67', 'inf@university.edu'),
('Факультет математики', 'ул. Университетская, 1, корпус Б', '+7 (495) 123-45-68', 'math@university.edu'),
('Экономический факультет', 'ул. Университетская, 1, корпус В', '+7 (495) 123-45-69', 'econ@university.edu');

INSERT INTO Positions (position_name, salary_range, responsibilities) VALUES
('Декан', '150000-200000', 'Руководство факультетом, стратегическое планирование'),
('Профессор', '120000-150000', 'Преподавание, научная работа'),
('Доцент', '80000-120000', 'Преподавание, методическая работа'),
('Старший преподаватель', '60000-80000', 'Преподавание'),
('Заведующий кафедрой', '100000-140000', 'Руководство кафедрой, преподавание');

INSERT INTO Employees (last_name, first_name, middle_name, birth_date, phone, email, education) VALUES
('Иванов', 'Петр', 'Сергеевич', '1975-05-15', '+7 (999) 111-22-33', 'ivanov@university.edu', 'доктор наук'),
('Смирнова', 'Мария', 'Александровна', '1980-08-20', '+7 (999) 222-33-44', 'smirnova@university.edu', 'кандидат наук'),
('Петров', 'Александр', 'Владимирович', '1978-03-10', '+7 (999) 333-44-55', 'petrov@university.edu', 'кандидат наук'),
('Козлова', 'Елена', 'Дмитриевна', '1985-11-30', '+7 (999) 444-55-66', 'kozlova@university.edu', 'магистр');

INSERT INTO Contracts (contract_number, start_date, end_date, contract_type, employee_id, departament_id, position_id) VALUES
('CTR-001', '2020-01-15', NULL, 'основной', 1, 1, 1),
('CTR-002', '2021-09-01', NULL, 'основной', 2, 1, 2),
('CTR-003', '2019-03-01', NULL, 'основной', 3, 2, 3),
('CTR-004', '2022-01-10', NULL, 'временный', 4, 3, 4);

INSERT INTO EmploymentHistory (employee_id, departament_id, position_id, start_date, end_date, status) VALUES
(1, 1, 2, '2018-01-10', '2019-12-31', 'работает'),
(1, 1, 1, '2020-01-15', NULL, 'работает'),
(2, 1, 2, '2021-09-01', NULL, 'работает'),
(3, 2, 3, '2019-03-01', NULL, 'работает'),
(4, 3, 4, '2022-01-10', NULL, 'работает');

