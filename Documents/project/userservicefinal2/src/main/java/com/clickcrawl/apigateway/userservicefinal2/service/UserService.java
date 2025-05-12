package com.clickcrawl.apigateway.userservicefinal2.service;

import com.clickcrawl.apigateway.userservicefinal2.entities.User;
import com.clickcrawl.apigateway.userservicefinal2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    // Save a new user
    public User save(User user) {
        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAll() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Update an existing user
    public User update(Long id, User updatedUser) {
        User user = getById(id);
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setMobile(updatedUser.getMobile());
        user.setStatus(updatedUser.getStatus());

        return userRepository.save(user);
    }

    // Patch (partially update) a user
    public User patch(Long id, User partial) {
        User user = getById(id);
        if (partial.getName() != null) user.setName(partial.getName());
        if (partial.getEmail() != null) user.setEmail(partial.getEmail());
        if (partial.getMobile() != null) user.setMobile(partial.getMobile());
        if (partial.getStatus() != null) user.setStatus(partial.getStatus());

        return userRepository.save(user);
    }

    // Delete user by ID
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    // Get a user by username (for login validation)
    public User getUserDetails(String username) {
        return userRepository.findByUsername(username)  // Query by username
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }
}
