import React from "react";
import DataTable from "react-data-table-component";

function TestTable() {
  const data = [
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 },
    { empId: "EMP1", empName: "Dipankar Mitra", empEmail: "dipankar@gmail.com", empSalary: 55000 }
  ];

  const columns = [
    { name: "Employee ID", selector: row => row.empId, sortable: true },
    { name: "Employee Name", selector: row => row.empName, sortable: true },
    { name: "Employee Email", selector: row => row.empEmail, sortable: true },
    { name: "Employee Salary", selector: row => row.empSalary, sortable: true }
  ];

  return (
    <div className="p-4 bg-blue-400">
      <DataTable
        className="bg-red-400"
        title={<h1 className="font-medium text-3xl bg-blue-400">Demo Table</h1>}
        columns={columns}
        data={data}
        pagination
        fixedHeader
        fixedHeaderScrollHeight="385px"
        selectableRows
        selectableRowsHighlight
        actions={<div className="w-full mr-2 py-1 bg-yellow-400"></div>}
        subHeader
        expandableRows
        highlightOnHover
        subHeaderComponent={<div className="w-full mr-2 bg-orange-400">fsd</div>}
        contextComponent={<div className="text-lg font-semibold bg-red-400">Utsav er pet kharap</div>}
        progressPending={false}
        // paginationTotalRows={}
        paginationRowsPerPageOptions={[3, 12, 23, 44]}
        progressComponent={<div>My loading...</div>}
        paginationIconFirstPage={<button className="text-lg px-1 top-0 rounded-full text-white bg-green-600" onClick={console.log}>Eii</button>}
      />
    </div>
  );
}

export default TestTable;
