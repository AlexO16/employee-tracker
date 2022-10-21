//Dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');
require('dotenv').config();

//Connect to mySQLworkbench
const connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "company_db"
});

connect.connect(function (err) {
    if (err) throw err;

});


//Function to display the sick ascii art logo and to begin the main prompts.  Ascii Credit: https://manytools.org/hacker-tools/ascii-banner/
function init() {

console.log('=====================================================================');
console.log('███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗');
console.log('██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝');
console.log('█████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  ');
console.log('██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  ');
console.log('███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗');
console.log('╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝');
console.log('                                                                     ');
console.log('████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗             ');
console.log('╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗            ');
console.log('   ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝            ');
console.log('   ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗            ');
console.log('   ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║            ');
console.log('   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝            ');
console.log('=====================================================================');

loadMainPrompts()
}



// Here we load the initial prompts with a series of options.
function loadMainPrompts() {
    inquirer.
        prompt({

            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee',
                'Exit',
            ]
        })
        .then(res => {
            let choice = res.choice;
            // Call the appropriate function depending on what the user chose
            switch (choice) {
                case 'View all departments':
                    viewDepartments();
                    break;

                case 'View all roles':
                    viewRoles();
                    break;

                case 'View all employees':
                    viewEmployees();
                    break;

                case 'Add a department':
                    addDepartment();
                    break;

                case 'Add a role':
                    addRole();
                    break;

                case 'Add an employee':
                    addEmployee();
                    break;

                case 'Update an employee':
                    updateEmployee();
                    break;

                default: 'Exit'
                    process.exit();
            }
        }
        )
        .catch((err) => { err && console.log('ERROR', err) })
};

//View all departments
function viewDepartments() {
    console.log('Showing all departments')
    connect.query('SELECT department.id AS id, department.name AS department FROM department', function (err, results) {
        if (err) throw err;
        console.table(results);
        loadMainPrompts()
    })

};

//view all roles
function viewRoles() {
    console.log('Showing all roles')
    connect.query(
        `SELECT role.id, role.title, department.name AS department, role.salary 
        FROM role 
        INNER JOIN department ON role.department_id = department.id`, function (err, results) {
        if (err) throw err;
        console.table(results);
        loadMainPrompts()
    })
};

//View all employees
function viewEmployees() {
    console.log('Showing all employees')
    connect.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id
        FROM employee 
        INNER JOIN role ON employee.role_id = role.id 
        INNER JOIN department ON role.department_id = department.id`, function (err, results) {
        if (err) throw err;
        console.table(results);
        loadMainPrompts()
    })
};

//Add a new department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the new department name?',
            name: 'addNewDep'
        }
    ])
        .then(answer => {
            //console.log(answer.addNewDep) // the name that the user typed
            // write a sql query that creates a new department with the name
            connect.query(`INSERT INTO department(name) VALUES(?)`, answer.addNewDep, (err, result) => {
                if (err) throw err
                viewDepartments()
            })
        })
};

//Add a new role
function addRole() {
    connect.query('SELECT *  FROM department', function (err, results) {
        if (err) throw err;
        //console.log(results)
        let depChoice = results.map((department) => {
            return {
                name: department.name,
                value: department.id
            }
        })
        //console.log(depChoice)
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the new role?',
                name: 'addNewRole',
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary',
            },
            {
                type: 'list',
                message: 'Which dpeartment does the role belong to?',
                name: 'choice',
                choices:
                    depChoice
            }
        ])
            .then(answer => {
                connect.query(`INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?)`, [answer.addNewRole,answer.salary,answer.choice], (err, result) => {
                    if(err) throw err
                    viewRoles()
                })
            })
    })
};

//Add a new employee
function addEmployee() {
    connect.query('SELECT *  FROM role', function (err, results) {
        if (err) throw err;
        //console.log(results)
        let roleChoice = results.map((role) => {
            return {
                name: role.title,
                value: role.id
            }
        })
        connect.query('SELECT manager_id FROM employee', function (err, results) {
            if (err) throw err;
            //console.log(results)
            let empChoice = results.map((employee) => {
                return {
                    name: employee.first_name + ' ' + employee.last_name,
                    value: employee.id
                }
           })
         inquirer.prompt([
        {
            type: 'input',
            message: 'What is the employees first name?',
            name: 'empFirstName',
        },
        {
            type: 'input',
            message: 'What is the employees last name?',
            name: 'empLastName',
        },
        {
            type: 'list',
            message: 'What is the employees role?',
            name: 'empRole',
            choices: roleChoice,
        },
        {
            type: 'list',
            message: 'Who is the employees manager?',
            name: 'manChoice',
            choices: empChoice
        },
        ])
            .then(answer => {
            connect.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`, [answer.empFirstName, answer.empLastName, answer.empRole, answer.manChoice], (err, result) => {
                if (err) throw err
                viewEmployees()
            })
            })
        })
    })
};
      
//Update a current employee
function updateEmployee() {
    connect.query('SELECT *  FROM employee', function (err, results) {
        if (err) throw err;
        //console.log(results)
        let empChoice = results.map((employee) => {
            return {
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id
            }
        })
        connect.query('SELECT * FROM role', function (err, results) {
            //console.log(results)
            if (err) throw err;
            let roleChoice = results.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
            inquirer.prompt(
                [
                {
                    type: 'list',
                    message: 'Which employee do you want to update?',
                    name: 'empUpdate',
                    choices: empChoice,
                },
                {
                    type: 'list',
                    message: 'What is their new role?',
                    name: 'roleUpdate',
                    choices: roleChoice,
                },
                ]
            ).then((answer) => {
                //console.log(answer)
                connect.query
                (`UPDATE employee SET role_id = ${answer.roleUpdate} WHERE id = ${answer.empUpdate}`, err, result => {
                    if (err) throw err
                    viewEmployees()
                })
            })
        })
})
};


// function deleteDepartment() {

// }

init();
