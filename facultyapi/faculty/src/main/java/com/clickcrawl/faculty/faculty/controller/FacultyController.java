package com.clickcrawl.faculty.faculty.controller;

import com.clickcrawl.faculty.faculty.dto.FacultyDTO;
import com.clickcrawl.faculty.faculty.entities.Faculty;
import com.clickcrawl.faculty.faculty.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    // Create Faculty
    @PostMapping
    public ResponseEntity<Faculty> createFaculty(@RequestBody FacultyDTO facultyDTO) {
        Faculty created = facultyService.createFaculty(facultyDTO);
        return ResponseEntity.ok(created);
    }

    // Get Faculty by ID
    @GetMapping("/{id}")
    public ResponseEntity<Faculty> getFacultyById(@PathVariable Long id) {
        return facultyService.getFacultyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Full Update (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Faculty> updateFaculty(@PathVariable Long id, @RequestBody FacultyDTO facultyDTO) {
        return facultyService.updateFaculty(id, facultyDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Partial Update (PATCH)
    @PatchMapping("/{id}")
    public ResponseEntity<Faculty> patchFaculty(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return facultyService.patchFaculty(id, updates)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete Faculty
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaculty(@PathVariable Long id) {
        boolean deleted = facultyService.deleteFaculty(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
