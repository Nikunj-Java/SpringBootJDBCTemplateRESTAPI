package com.neueda.restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
//
@RestController
@RequestMapping("/api/v1/employee")
@CrossOrigin(origins = {"http://10.9.71.48:8085", "http://127.0.0.1:5500"})
public class EmployeeController {


    @Autowired
    private EmployeeService service;

    // GET All Employees
    // i need response in JSON
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getAllEmployees() {
        List<Employee> employees = service.getAllEmployees();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Employees fetched successfully");
        response.put("data", employees);

        return ResponseEntity.status(HttpStatus.OK).body(response);

    }

    // GET Employee By Id
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getEmployee(@PathVariable int id) {

        Employee employee = service.getEmployeeById(id);
        // handle employee exception here
        if (employee == null) {
            throw new EmployeeNotFoundException(
                    "Employee with ID " + id + " not found");
        }



        Map<String, Object> response = new HashMap<>();
        response.put("message", "Employee fetched successfully");
        response.put("data", employee);

        return ResponseEntity.ok(response);
    }

    // POST Employee
    @PostMapping("/")
    public ResponseEntity<Map<String, Object>> addEmployee(@RequestBody Employee employee) {

        int result = service.saveEmployee(employee);

        if (result > 0) {
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Employee added successfully",
                            "data", employee
                    )
            );
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of(
                        "message", "Failed to add employee",
                        "data", employee
                )
        );
    }

    // PUT Employee
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateEmployee(
            @PathVariable int id,
            @RequestBody Employee employee) {

        employee.setId(id);

        int result = service.updateEmployee(id, employee);

        if (result > 0) {
            return ResponseEntity.ok(
                    Map.of(
                            "message", "Employee updated successfully",
                            "data", employee
                    )
            );
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of(
                        "message", "Failed to update employee",
                        "data", employee
                )
        );
    }

    // DELETE Employee
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEmployee(@PathVariable int id) {

        int result = service.deleteEmployee(id);

        if (result > 0) {
            return ResponseEntity.ok(
                    Map.of(
                            "message", "Employee deleted successfully",
                            "data", id
                    )
            );
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of(
                        "message", "Failed to delete employee",
                        "data", id
                )
        );
    }
}