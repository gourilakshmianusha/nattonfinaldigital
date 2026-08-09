package com.clickcrawl.faculty.faculty.service;

import com.clickcrawl.faculty.faculty.dto.FacultyDTO;
import com.clickcrawl.faculty.faculty.entities.Faculty;
import com.clickcrawl.faculty.faculty.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    public Faculty createFaculty(FacultyDTO facultyDTO) {
        Faculty faculty = new Faculty();

        faculty.setFirstName(facultyDTO.getFirstName());
        faculty.setLastName(facultyDTO.getLastName());
        faculty.setAge(facultyDTO.getAge());
        faculty.setGender(facultyDTO.getGender());
        faculty.setEmail(facultyDTO.getEmail());
        faculty.setContact(facultyDTO.getContact());
        faculty.setAddress(facultyDTO.getAddress());
        faculty.setCity(facultyDTO.getCity());
        faculty.setPincode(facultyDTO.getPincode());
        faculty.setQualification(facultyDTO.getQualification());
        faculty.setClassYouTeach(facultyDTO.getClassYouTeach());
        faculty.setSubjectsYouTeach(facultyDTO.getSubjectsYouTeach());
        faculty.setExperienceOfTeaching(facultyDTO.getExperienceOfTeaching());
        faculty.setPreviousExperiences(facultyDTO.getPreviousExperiences());

        // Set photo URL (string)
        faculty.setPhoto(facultyDTO.getPhoto());

        return facultyRepository.save(faculty);
    }

    public boolean deleteFaculty(Long id) {
        if (facultyRepository.existsById(id)) {
            facultyRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
