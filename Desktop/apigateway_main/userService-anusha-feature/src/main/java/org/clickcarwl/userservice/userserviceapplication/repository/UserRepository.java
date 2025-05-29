package org.clickcarwl.userservice.userserviceapplication.repository;

import org.clickcarwl.userservice.userserviceapplication.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username); // used for registration unique check
    List<User> findAllByUsername(String username);  // used in login (can return multiple)
}

