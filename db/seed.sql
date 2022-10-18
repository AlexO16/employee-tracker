INSERT INTO department (name)
VALUES 
('Engirneering'),
('Finance'),
('Legal'),
('sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 99000, 1),
('Lead Engineer', 150000, 1),
('Accountant', 125000, 2),
('Account Manager', 160000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3),
('Sales Lead', 100000, 4),
('Salesperson', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Ashley', 'Rodriguez', 1, null),
('Kevin', 'Tupik', 2, 2),
('Malia', 'Brown', 3, null),
('Kunal', 'Singh', 4, 4),
('Tom', 'Allen', 5, null),
('Sarah', 'Lourd', 6, 6),
('John', 'Doe', 7, null),
('Mike', 'Chan', 8, 8);