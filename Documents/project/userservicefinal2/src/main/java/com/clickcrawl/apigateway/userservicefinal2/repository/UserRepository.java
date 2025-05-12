package com.clickcrawl.apigateway.userservicefinal2.repository;

import com.clickcrawl.apigateway.userservicefinal2.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Method to find a user by their username
    Optional<User> findByUsername(String username);

    // You can still keep the findByEmail method if necessary
    Optional<User> findByEmail(String email);
}
