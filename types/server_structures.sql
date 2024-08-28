CREATE TABLE KBN_Users(
    id NUMBER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    column1 INTEGER[],
    column2 INTEGER[],
    column3 INTEGER[],
    column1_name VARCHAR(255),
    column2_name VARCHAR(255),
    column3_name VARCHAR(255)
);

--
CREATE TABLE KBN_Tasks(
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
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

-- Check User Exists [✅]
SELECT id FROM KBN_Users where name='name';

-- Create new User [✅]

-- Update User [✅]
UPDATE KBN_Users SET column1 = ARRAY[1,2,3]::INTEGER[] WHERE id=0;

-- Fetch User Tasks: DONE IN SOME TIMEFRAME [✅]

SELECT * FROM KBN_Tasks WHERE 
    done IS TRUE and 
    CURRENT_TIMESTAMP - endDate < (7 * INTERVAL '1 day');

-- Update Task (Individually) [✅]

UPDATE KBN_Tasks SET description='descricao teste updated' WHERE id=3;


-- Add Task [✅]
INSERT INTO KBN_Tasks
    (id, userId, name, description, color, startDate, endDate, done)
    VALUES
    (0, 0, 1, 'Task N1', 'This is the task number 1', '#003bff', TO_TIMESTAMP('03/02/2002', 'DD/MM/YYYY'), null, false);


-- Delete Task [✅]
DELETE FROM KBN_Tasks WHERE id=100;

---------------------------------
-- Populating:

INSERT INTO KBN_Users(id, name, column1, column2, column3) VALUES (0, 'Caio', ARRAY[]::INTEGER[], ARRAY[]::INTEGER[], ARRAY[]::INTEGER[]);

INSERT INTO KBN_Tasks
    (id, userId, name, description, color, startDate, endDate, done)
    VALUES
    (0, 0, 'Task N1', 'This is the task number 1', '#003bff', TO_TIMESTAMP('03/02/2002', 'DD/MM/YYYY'), null, false);

INSERT INTO KBN_Tasks
    (id, userId, name, description, color, startDate, endDate, done)
    VALUES
    (2, 0, 'Task N2', 'This is the task number 2', '#45ff00', TO_TIMESTAMP('03/02/2002', 'DD/MM/YYYY'), TO_TIMESTAMP('03/04/2002', 'DD/MM/YYYY'), true);

INSERT INTO KBN_Tasks
    (id, userId, name, description, color, startDate, endDate, done)
    VALUES
    (3, 0, 'Task N3', 'This is the task number 3', '#45ff00', TO_TIMESTAMP('03/02/2002', 'DD/MM/YYYY'), TO_TIMESTAMP('27/08/2024', 'DD/MM/YYYY'), true);

