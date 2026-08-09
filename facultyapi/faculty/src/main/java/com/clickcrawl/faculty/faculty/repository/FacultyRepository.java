package com.clickcrawl.faculty.faculty.repository;

import com.clickcrawl.faculty.faculty.entities.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
}

