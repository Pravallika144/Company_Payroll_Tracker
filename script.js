/* =========================================
        COMPANY PAYROLL TRACKER
        JavaScript File
========================================= */


/* =========================================
        GLOBAL VARIABLES
========================================= */

// Array to store employee records
let employees = [];

// Variable used while editing an employee
let editIndex = -1;


/* =========================================
        LOAD DATA FROM LOCAL STORAGE
========================================= */

// Check whether data is already saved
if (localStorage.getItem("employees") != null) {

    // Convert string into array
    employees = JSON.parse(localStorage.getItem("employees"));

    // Display saved employees
    displayEmployees();

}


/* =========================================
        ADD EMPLOYEE
========================================= */

function addEmployee() {

    // Read values from input fields
    let id = document.getElementById("empId").value.trim();

    let name = document.getElementById("empName").value.trim();

    let department = document.getElementById("department").value;

    let basicSalary = Number(document.getElementById("salary").value);


    /* ------------------------------
        Validation
    ------------------------------ */

    if (id == "") {

        alert("Please enter Employee ID");

        return;
    }

    if (name == "") {

        alert("Please enter Employee Name");

        return;
    }

    if (department == "") {

        alert("Please select Department");

        return;
    }

    if (basicSalary <= 0) {

        alert("Please enter a valid salary");

        return;
    }


    /* ------------------------------
        Check Duplicate Employee ID
    ------------------------------ */

    if (editIndex == -1) {

        for (let i = 0; i < employees.length; i++) {

            if (employees[i].id == id) {

                alert("Employee ID already exists.");

                return;

            }

        }

    }


    /* ------------------------------
        Salary Calculation
    ------------------------------ */

    let hra = basicSalary * 0.20;

    let da = basicSalary * 0.10;

    let grossSalary = basicSalary + hra + da;

    let tax = grossSalary * 0.05;

    let netSalary = grossSalary - tax;


    /* ------------------------------
        Employee Object
    ------------------------------ */

    let employee = {

        id: id,

        name: name,

        department: department,

        basic: basicSalary,

        hra: hra,

        da: da,

        gross: grossSalary,

        tax: tax,

        net: netSalary

    };


    /* ------------------------------
        Add OR Update Employee
    ------------------------------ */

    if (editIndex == -1) {

        // New employee
        employees.push(employee);

    }

    else {

        // Update existing employee
        employees[editIndex] = employee;

        editIndex = -1;

        document.querySelector(".btn").innerHTML = "Add Employee";

    }


    /* ------------------------------
        Save Data
    ------------------------------ */

    localStorage.setItem(

        "employees",

        JSON.stringify(employees)

    );


    /* ------------------------------
        Refresh Table
    ------------------------------ */

    displayEmployees();


    /* ------------------------------
        Clear Form
    ------------------------------ */

    clearForm();

}



/* =========================================
        DISPLAY EMPLOYEES
========================================= */

function displayEmployees() {

    let table = document.getElementById("employeeTable");

    table.innerHTML = "";


    // Total salary of all employees
    let totalPayroll = 0;


    // Display one row for each employee
    for (let i = 0; i < employees.length; i++) {

        totalPayroll += employees[i].net;

        let row =

        `<tr>

            <td>${employees[i].id}</td>

            <td>${employees[i].name}</td>

            <td>${employees[i].department}</td>

            <td>₹${employees[i].basic.toFixed(2)}</td>

            <td>₹${employees[i].hra.toFixed(2)}</td>

            <td>₹${employees[i].da.toFixed(2)}</td>

            <td>₹${employees[i].tax.toFixed(2)}</td>

            <td>₹${employees[i].net.toFixed(2)}</td>

            <td>

                <button
                    class="editBtn"
                    onclick="editEmployee(${i})">

                    Edit

                </button>

                <button
                    class="deleteBtn"
                    onclick="deleteEmployee(${i})">

                    Delete

                </button>

            </td>

        </tr>`;

        table.innerHTML += row;

    }


    // Update summary cards
    document.getElementById("totalEmployees").innerHTML = employees.length;

    document.getElementById("totalPayroll").innerHTML =
    totalPayroll.toFixed(2);


    if (employees.length > 0) {

        let averageSalary = totalPayroll / employees.length;

        document.getElementById("averageSalary").innerHTML =
        averageSalary.toFixed(2);

    }

    else {

        document.getElementById("averageSalary").innerHTML = "0";

    }
    document.getElementById("highestSalary").innerHTML =
highestSalary();

document.getElementById("lowestSalary").innerHTML =
lowestSalary();

}
/* =========================================
        EDIT EMPLOYEE
========================================= */

function editEmployee(index) {

    // Get employee details
    let employee = employees[index];

    // Fill form with employee data
    document.getElementById("empId").value = employee.id;

    document.getElementById("empName").value = employee.name;

    document.getElementById("department").value = employee.department;

    document.getElementById("salary").value = employee.basic;

    // Save index of employee being edited
    editIndex = index;

    // Change button text
    document.querySelector(".btn").innerHTML = "Update Employee";

}



/* =========================================
        DELETE EMPLOYEE
========================================= */

function deleteEmployee(index) {

    let choice = confirm("Do you want to delete this employee?");

    if (choice) {

        // Remove employee from array
        employees.splice(index, 1);

        // Save updated array
        localStorage.setItem(
            "employees",
            JSON.stringify(employees)
        );

        // Refresh table
        displayEmployees();

    }

}



/* =========================================
        SEARCH EMPLOYEE
========================================= */

function searchEmployee() {

    // Read search value
    let input = document.getElementById("search").value.toLowerCase();

    // Get all table rows
    let rows = document.querySelectorAll("#employeeTable tr");

    // Check every row
    rows.forEach(function(row) {

        let employeeId = row.cells[0].innerText.toLowerCase();

        let employeeName = row.cells[1].innerText.toLowerCase();

        // Search by ID or Name
        if (
            employeeId.includes(input) ||
            employeeName.includes(input)
        ) {

            row.style.display = "";

        }

        else {

            row.style.display = "none";

        }

    });

}



/* =========================================
        CLEAR INPUT FIELDS
========================================= */

function clearForm() {

    document.getElementById("empId").value = "";

    document.getElementById("empName").value = "";

    document.getElementById("department").selectedIndex = 0;

    document.getElementById("salary").value = "";

}
/* =========================================
        DOWNLOAD PAYROLL REPORT (CSV)
========================================= */

function downloadCSV() {

    // Check whether employee list is empty
    if (employees.length == 0) {

        alert("No employee data available.");

        return;
    }

    // CSV Heading
    let csvData =
        "Employee ID,Employee Name,Department,Basic Salary,HRA,DA,Tax,Net Salary\n";

    // Add each employee data
    for (let i = 0; i < employees.length; i++) {

        csvData +=
            employees[i].id + "," +
            employees[i].name + "," +
            employees[i].department + "," +
            employees[i].basic + "," +
            employees[i].hra + "," +
            employees[i].da + "," +
            employees[i].tax + "," +
            employees[i].net + "\n";

    }

    // Create file
    let blob = new Blob([csvData], { type: "text/csv" });

    let url = window.URL.createObjectURL(blob);

    let link = document.createElement("a");

    link.href = url;

    link.download = "Payroll_Report.csv";

    link.click();

}



/* =========================================
        CLEAR ALL EMPLOYEE RECORDS
========================================= */

function clearAllEmployees() {

    let choice = confirm("Delete all employee records?");

    if (choice) {

        employees = [];

        localStorage.removeItem("employees");

        displayEmployees();

    }

}



/* =========================================
        FIND HIGHEST SALARY
========================================= */

function highestSalary() {

    if (employees.length == 0) {

        return 0;

    }

    let highest = employees[0].net;

    for (let i = 1; i < employees.length; i++) {

        if (employees[i].net > highest) {

            highest = employees[i].net;

        }

    }

    return highest.toFixed(2);

}



/* =========================================
        FIND LOWEST SALARY
========================================= */

function lowestSalary() {

    if (employees.length == 0) {

        return 0;

    }

    let lowest = employees[0].net;

    for (let i = 1; i < employees.length; i++) {

        if (employees[i].net < lowest) {

            lowest = employees[i].net;

        }

    }

    return lowest.toFixed(2);

}



/* =========================================
        SHOW PROJECT INFORMATION
========================================= */

function projectInfo() {

    console.log("Company Payroll Tracker");

    console.log("Developed using HTML, CSS and JavaScript");

    console.log("Employee Records : " + employees.length);

}