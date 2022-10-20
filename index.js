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


//Use this function to display the ascii art logo and to begin the main prompts
function init() {


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
            connect.end();
    }
  }
)
.catch((err) => {err && console.log('ERROR', err)})
};

function viewDepartments() {
    console.log('Showing all departments')
    connect.query('SELECT department.id AS id, department.name AS department FROM department', function (err, results){
        if (err) throw err;
        console.table(results);
        loadMainPrompts()
    })
    
};

function viewRoles() {
    console.log('Showing all roles')
    connect.query(
        `SELECT role.id, role.title, department.name AS department, role.salary 
        FROM role 
        INNER JOIN department ON role.department_id = department.id`, function (err, results){
        if (err) throw err;
        console.table(results);
        loadMainPrompts()
    })
};

function viewEmployees() {
    console.log('Showing all employees')
    connect.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager_id AS manager 
        FROM employee 
        INNER JOIN role ON employee.role_id = role.id 
        INNER JOIN department ON role.department_id = department.id`, function (err, results){
        if (err) throw err;
        console.table(results);
        loadMainPrompts()
    })
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the new department name?',
            name: 'addNewDep'
        }
    ])
    .then(answer)
}

init();
// function viewEmployees(){
//     //  add yourlogic to see wmployees
//     connection.query('select * from department', function (err, result) {
//         cTable(result)
//     })
// }

// function addEmployee(){
//     inquirer.prompt({
//         type:'input',
//         name:'employee_name',
//         message:'What\s'
//     },
//     {
//         type:'input',
//         name:'employee_last_name',
//         message:'What\s'
//     })
//     .then((res)=> {
//         console.log(res)
//         const {employee_name, employee_last_name} = res
//         connection.query('insert into role SET ?', {first_name: employee_name, last_name:employee_last_name} , function(err, res){
//             cTable(res)
//         })
//     }).catch((err)=> {console.log(err)})
    
// }

