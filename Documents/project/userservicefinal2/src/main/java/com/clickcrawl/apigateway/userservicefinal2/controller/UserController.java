package com.clickcrawl.apigateway.userservicefinal2.controller;

import com.clickcrawl.apigateway.userservicefinal2.controller.util.JwtUtil;
import com.clickcrawl.apigateway.userservicefinal2.entities.LoginRequest;
import com.clickcrawl.apigateway.userservicefinal2.entities.User;
import com.clickcrawl.apigateway.userservicefinal2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Endpoint to handle user login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Retrieve user details using the provided username
            User user = userService.getUserDetails(loginRequest.getUsername());

            // Check if password matches
            if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
                // Generate JWT token
                String token = jwtUtil.generateToken(user.getUsername());
                return ResponseEntity.ok(Map.of("token", token));  // Return the token
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }
        } catch (Exception e) {
            // Handle user not found or other errors
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint to handle user registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Save the user to the database
            User savedUser = userService.save(user);
            return ResponseEntity.status(201).body(savedUser);  // Return the saved user
        } catch (Exception e) {
            // Handle errors like user already exists or database issues
            return ResponseEntity.status(500).body(Map.of("error", "User registration failed: " + e.getMessage()));
        }
    }

    // Protected endpoint that requires a valid JWT token
    @PostMapping("/protected")
    public String protectedEndpoint(@RequestHeader("Authorization") String token) {
        // Remove "Bearer " from the token string
        String jwt = token.replace("Bearer ", "");

        // Validate the JWT token
        if (jwtUtil.validateToken(jwt)) {
            return "Hello, authenticated user!";
        } else {
            throw new RuntimeException("Invalid or expired token");
        }
    }
}
