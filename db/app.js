const inquirer = require('inquirer');
// const mysql = require('mysql');
// const consoleTable = require('console.table');
const connection = require('./db');

//build the main menu functions
function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Exit',
                ],
            },
        ])
        .then((answer) => {
            switch (answer.choice) {
                case 'View all departments':
                    //need to test remove comment when done
                    viewAllDepartments();
                    break;

                case 'View all roles':
                    //need to test remove comment when done
                    viewAllRoles();
                    break;

                case 'View all employees':
                    //need to test remove comment when done
                    viewAllEmployees();
                    break;

                case 'Add a department':
                    //need to test remove comment when done
                    addDepartment();
                    break;

                case 'Add a role':
                    //need to test remove comment when done
                    addRole();
                    break;

                case 'Add an employee':
                    //need to test remove comment when done
                    addEmployee();
                    break;

                case 'Update an employee role':
                    //need to test remove comment when done
                    updateEmployeeRole();
                    break;

                case 'Exit':
                    console.log('Exiting the application.');
                    process.exit();

                default:
                    console.log('Invalid choice. Please try again.');
                    mainMenu();
            }
        });
}



//CREATE THE VARIOUS FUNCTIONS

// Function to view all departments
function viewAllDepartments() {
    const query = 'SELECT * FROM departments';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\nAll Departments:\n');
        console.table(res);

        mainMenu();
    });
}

// Function to view all roles
function viewAllRoles() {
    const query = `SELECT
    r.id AS role_id,
    r.title AS role,
    r.salary AS salary,
    d.name AS department
FROM roles r
LEFT JOIN departments d ON r.department_id = d.id;
`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\nAll Roles:\n');
        console.table(res);

        mainMenu();
    });
}

// Function to view all employees
function viewAllEmployees() {
    const query = `SELECT
    e.id AS employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS Employee,
    r.title AS role,
    r.salary AS Salary,
    d.name AS department,
    CONCAT(m.first_name, ' ', m.last_name) AS Manager
FROM employees e
LEFT JOIN roles r ON e.role_id = r.id
LEFT JOIN departments d ON r.department_id = d.id
LEFT JOIN employees m ON e.manager_id = m.id;
`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\nAll Employees:\n');
        console.table(res);

        mainMenu();
    });
}

// Function to add a new department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the new department:',
            },
        ])
        .then((answer) => {
            const { name } = answer;

            // Insert the new department into the database
            const query = 'INSERT INTO departments (name) VALUES (?)';
            connection.query(query, [name], (err, res) => {
                if (err) {
                    console.error('Error adding department:', err);
                } else {
                    console.log('Department added successfully!');
                }

                mainMenu();
            });
        });
}


// Function to add a new role
function addRole() {
    connection.query("SELECT * FROM departments", (err, result) => {
        const departmentList = result.map(({ id, name }) => {
            return ({ value: id, name: name })
        })

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the title of the new role:',
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'Enter the salary for the new role:',
                },
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'Select the department for the new role:',
                    choices: departmentList,
                },
            ])
            .then((answers) => {
                const { title, salary, departmentId } = answers;

                // Insert the new role into the database
                const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
                connection.query(query, [title, salary, departmentId], (err, res) => {
                    if (err) {
                        console.error('Error adding role:', err);
                    } else {
                        console.log('Role added successfully!');
                    }

                    mainMenu();
                });
            });
    })
}

// Function to add an employee
function addEmployee() {
    connection.query("SELECT * FROM roles", (err, result) => {
        const rolesList = result.map(({ id, title }) => {
            return ({ value: id, name: title })
        })
    connection.query("SELECT * FROM employees", (err, result) => {
        const employeeList = result.map(({ id, first_name, last_name }) => {
            return ({ value: id, name: `${first_name} ${last_name}`})
        })

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: "Enter the employee's first name:",
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: "Enter the employee's last name:",
                    },
                    {
                        type: 'list',
                        name: 'roleId',
                        message: "Select the employee's role:",
                        choices: rolesList,
                    },
                    {
                        type: 'list',
                        name: 'managerId',
                        message: "Select the employee's manager:",
                        choices: [...employeeList, {value:null, name:"None"}],
                    },
                ])
                .then((answers) => {
                    const { firstName, lastName, roleId, managerId } = answers;

                    // Insert the new employee into the database
                    const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                    connection.query(query, [firstName, lastName, roleId, managerId], (err, res) => {
                        if (err) {
                            console.error('Error adding employee:', err);
                        } else {
                            console.log('Employee added successfully!');
                        }

                        mainMenu();
                    });
                });
        })
    })
}


// Function to update an employee's role
function updateEmployeeRole() {
    // Query the database for list of employees currently in the database
    const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employees';

    connection.query(employeeQuery, (err, employees) => {
        if (err) {
            console.error('Error querying employees:', err);
            mainMenu();
            return;
        }

        const rolesQuery = 'SELECT * FROM roles';
        connection.query(rolesQuery, (err, roles) => {
            if (err) {
                console.error('Error querying employees:', err);
                mainMenu();
                return;
            }
        

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select the employee to update:',
                    choices: employees.map((employee) => ({
                        name: employee.employee_name,
                        value: employee.id,
                    })),
                },
                {
                    type: 'list',
                    name: 'newRoleId',
                    message: 'Select the new role for the employee:',
                    choices: roles.map((role) => ({
                        name: role.title,
                        value: role.id,
                    })),
                },
                {
                    type: 'list',
                    name: 'newManagerId',
                    message: 'Select the new manager for the employee:',
                    choices: employees.map((employee) => ({
                        name: employee.employee_name,
                        value: employee.id,
                    })),
                },
            ])
            .then((answers) => {
                const { employeeId, newManagerId, newRoleId } = answers;

                // Update the employee's role in the database
                const updateQuery = 'UPDATE employees SET role_id = ?, manager_id = ? WHERE id = ?';
                connection.query(updateQuery, [newRoleId, newManagerId, employeeId], (err, res) => {
                    if (err) {
                        console.error('Error updating employee role:', err);
                    } else {
                        console.log('Employee role updated successfully!');
                    }

                    mainMenu();
                });
            });
        });
    });
}

module.exports = { mainMenu };

