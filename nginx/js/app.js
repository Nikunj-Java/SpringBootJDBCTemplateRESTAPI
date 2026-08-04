//const API = "http://localhost:8082/api/v1/employee/"; // Change if needed
const API = "http://10.9.71.48:8082/api/v1/employee/"; // Change if needed
document.getElementById("saveEmployee").addEventListener("click", saveEmployee);
let pieChart = null;
let barChart = null;
let editingId = null;
let employees = [];

async function loadEmployees() {
  try {
    const response = await fetch(API);
    const result = await response.json();

    const data = result.data;
    employees = data;

    document.getElementById("empCount").innerText = data.length;

    const salaries = data.map(e => Number(e.salary) || 0);
    const avg = salaries.reduce((a, b) => a + b, 0) / (salaries.length || 1);
    document.getElementById("avgSalary").innerText = "₹" + Math.round(avg).toLocaleString();
    document.getElementById("maxSalary").innerText = "₹" + Math.max(...salaries, 0).toLocaleString();

    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    const dept = {};

    data.forEach(e => {
      tbody.innerHTML += `<tr>
   <td>${e.id}</td>
   <td>${e.name}</td>
   <td>${e.department}</td>
   <td>₹${Number(e.salary).toLocaleString()}</td>
    <td>
    <button class="btn btn-sm btn-warning" onclick='edit(${JSON.stringify(e).replace(/'/g, "&#39;")})'>Edit</button>
    <button class="btn btn-sm btn-danger" onclick='removeEmp(${e.id})'>Delete</button>
   </td>
   </tr>`;
      dept[e.department] = (dept[e.department] || 0) + 1;
    });


    document.getElementById("deptCount").innerText = Object.keys(dept).length;

    new Chart(document.getElementById("pieChart"), {
      type: "pie",
      data: { labels: Object.keys(dept), datasets: [{ data: Object.values(dept) }] }
    });

    new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: { labels: data.map(e => e.name), datasets: [{ label: "Salary", data: salaries }] },
      options: { plugins: { legend: { display: false } } }
    });

  } catch (e) {
    console.error(e);

    if (e instanceof TypeError) {
      alert("Unable to connect to Spring Boot API.");
    }
  }

}
loadEmployees();
async function removeEmp(id) {

  if (!confirm("Delete employee?")) return;

  const response = await fetch(API + id, {
    method: "DELETE"
  });

  console.log(response.status);

  loadEmployees();
}
document.getElementById("searchEmployee").addEventListener("input", function () {

  const keyword = this.value.toLowerCase();

  const filteredEmployees = employees.filter(emp => {

    return (
      emp.id.toString().includes(keyword) ||
      emp.name.toLowerCase().includes(keyword) ||
      emp.department.toLowerCase().includes(keyword) ||
      emp.salary.toString().includes(keyword)
    );

  });

  renderTable(filteredEmployees);

});

function renderTable(data) {

  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  data.forEach(e => {

    tbody.innerHTML += `
            <tr>
                <td>${e.id}</td>
                <td>${e.name}</td>
                <td>${e.department}</td>
                <td>₹${Number(e.salary).toLocaleString()}</td>
                <td>
                    <button class="btn btn-warning btn-sm"
                        onclick="edit(${JSON.stringify(e)})">
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="removeEmp(${e.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;

  });

}
async function saveEmployee() {

  const employee = {

    name: document.getElementById("empName").value.trim(),

    department: document.getElementById("empDepartment").value,

    salary: Number(document.getElementById("empSalary").value)

  };

  // Validation
  if (employee.name === "") {
    alert("Please enter employee name.");
    return;
  }

  if (employee.department === "") {
    alert("Please select department.");
    return;
  }

  if (!employee.salary || employee.salary <= 0) {
    alert("Please enter a valid salary.");
    return;
  }
  const isEdit = editingId !== null;

  const url = isEdit ? API + editingId : API;

  const method = isEdit ? "PUT" : "POST";

  try {

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(employee)
    });

    if (!response.ok) {
      throw new Error("Failed to save employee");
    }

    alert(isEdit
      ? "Employee Updated Successfully"
      : "Employee Added Successfully");

    // Close Modal
    bootstrap.Modal.getInstance(
      document.getElementById("employeeModal")
    ).hide();

    // Reset Form
    document.getElementById("employeeForm").reset();

    // Reset Edit Mode
    editingId = null;

    // Reset Button
    document.getElementById("saveEmployee").innerHTML =
      '<i class="bi bi-check-circle"></i> Save Employee';

    // Reload Table
    loadEmployees();

  } catch (err) {

    console.error(err);

    alert("Operation failed.");

  }

}

function edit(employee) {

  editingId = employee.id;

  document.getElementById("empName").value = employee.name;
  document.getElementById("empDepartment").value = employee.department;
  document.getElementById("empSalary").value = employee.salary;

  document.getElementById("saveEmployee").innerHTML =
    '<i class="bi bi-pencil-square"></i> Update Employee';

  new bootstrap.Modal(
    document.getElementById("employeeModal")
  ).show();
}