package com.clickcrawl.apigateway.userservicefinal2.controller.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";  // Secret key for signing

    // Generate JWT token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // Set username as the subject
                .setIssuedAt(new Date()) // Set current date as issued date
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // Set expiration (1 hour)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // Sign the token using HS512 and secret key
                .compact(); // Return the generated token
    }

    // Validate JWT token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token); // Parse and validate the token
            return true;
        } catch (Exception e) {
            // Log or handle the exception appropriately
            System.out.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }

    // Extract username from token
    public String extractUsername(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject(); // Return the subject (username) from the claims
    }
}
