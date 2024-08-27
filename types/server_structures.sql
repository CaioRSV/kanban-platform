CREATE TABLE KBN_Users(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

--
CREATE TABLE KBN_NameColumns(
    userId INTEGER PRIMARY KEY,
    column1 VARCHAR(255),
    column2 VARCHAR(255),
    column3 VARCHAR(255)
);
--
CREATE TABLE KBN_Tasks(
    id INTEGER PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    columnId INTEGER NOT NULL,
    name VARCHAR(255),
    description VARCHAR(255),
    color VARCHAR(255),
    startDate TIMESTAMP,
    endDate TIMESTAMP,
    done BOOLEAN NOT NULL
);
--

-------- Example queries
--

-- Check User Exists
SELECT id FROM KBN_Users where name='name';

-- Fetch User Tasks: NOT DONE
SELECT * FROM KBN_Tasks WHERE done IS NOT TRUE;

-- Fetch User Tasks: DONE IN SOME TIMEFRAME

SELECT * FROM KBN_Tasks WHERE 
    done IS TRUE and 
    CURRENT_TIMESTAMP - endDate < (7 * INTERVAL '1 day');

-- Update Task (Individually)

UPDATE KBN_Tasks SET description='descricao teste updated' WHERE id=3;


-- Add Task
INSERT INTO KBN_Tasks
    (id, userId, columnId, name, description, color, startDate, endDate, done)
    VALUES
    (0, 0, 1, 'Task N1', 'This is the task number 1', '#003bff', TO_TIMESTAMP('03/02/2002', 'DD/MM/YYYY'), null, false);


-- Delete Task
DELETE FROM KBN_Tasks WHERE id=100;


-- Add Column Names
INSERT INTO KBN_NameColumns(userId, column1, column2, column3) 
    VALUES (0, 'Para fazer', 'Fazendo', 'Feito');

-- Fetch Column Names
SELECT * FROM KBN_NameColumns where userId=0;


-- Update Column names
UPDATE KBN_NameColumns SET column1 = 'Pendentes';

---------------------------------
-- Populating:

INSERT INTO KBN_Users(id, name) VALUES (0, 'Caio');

INSERT INTO KBN_Tasks
    (id, userId, columnId, name, description, color, startDate, endDate, done)
    VALUES
    (0, 0, 1, 'Task N1', 'This is the task number 1', '#003bff', TO_TIMESTAMP('03/02/2002', 'DD/MM/YYYY'), null, false);

INSERT INTO KBN_Tasks
    (id, userId, columnId, name, description, color, startDate, endDate, done)
    VALUES
    (2, 0, 3, 'Task N2', 'This is the task number 2', '#45ff00', TO_TIMESTAMP('03/02/2002', 'DD/MM/YYYY'), TO_TIMESTAMP('03/04/2002', 'DD/MM/YYYY'), true);

INSERT INTO KBN_Tasks
    (id, userId, columnId, name, description, color, startDate, endDate, done)
    VALUES
    (3, 0, 3, 'Task N3', 'This is the task number 3', '#45ff00', TO_TIMESTAMP('03/02/2002', 'DD/MM/YYYY'), TO_TIMESTAMP('27/08/2024', 'DD/MM/YYYY'), true);

