package org.clickcarwl.userservice.userserviceapplication.service;

import lombok.RequiredArgsConstructor;
import org.clickcarwl.userservice.userserviceapplication.entities.User;
import org.clickcarwl.userservice.userserviceapplication.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Save a new user with password hashing
    public User save(User user) {
        // Check if username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
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

    // Update user fully
    public User update(Long id, User updatedUser) {
        User user = getById(id);

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setMobile(updatedUser.getMobile());
        user.setStatus(updatedUser.getStatus());

        if (updatedUser.getUsername() != null) {
            user.setUsername(updatedUser.getUsername());
        }

        if (updatedUser.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(user);
    }

    // Patch (partial update)
    public User patch(Long id, User partial) {
        User user = getById(id);

        if (partial.getName() != null) user.setName(partial.getName());
        if (partial.getEmail() != null) user.setEmail(partial.getEmail());
        if (partial.getMobile() != null) user.setMobile(partial.getMobile());
        if (partial.getStatus() != null) user.setStatus(partial.getStatus());
        if (partial.getUsername() != null) user.setUsername(partial.getUsername());
        if (partial.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(partial.getPassword()));
        }

        return userRepository.save(user);
    }

    // Delete user by ID
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    // Used in login - get user by username
    public User getUserDetails(String username) {
        List<User> users = userRepository.findAllByUsername(username);
        if (users.isEmpty()) {
            throw new RuntimeException("User not found with username: " + username);
        } else if (users.size() > 1) {
            throw new RuntimeException("Multiple users found with username: " + username);
        }
        return users.get(0);
    }

    // ✅ Add this for controller compatibility
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    // ✅ Add this for controller compatibility
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
