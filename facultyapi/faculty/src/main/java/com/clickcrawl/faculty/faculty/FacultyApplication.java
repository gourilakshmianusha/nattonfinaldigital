package com.clickcrawl.faculty.faculty;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.clickcrawl.faculty"})

public class FacultyApplication {

	public static void main(String[] args) {
		SpringApplication.run(FacultyApplication.class, args);
	}

}
