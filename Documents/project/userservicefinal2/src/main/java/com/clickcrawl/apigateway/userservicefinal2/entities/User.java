package com.clickcrawl.apigateway.userservicefinal2.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String mobile;

    @Column(unique = true)
    private String email;

    private String status;

   // Store base64-encoded image or plain text

    private String password; // Added password field for authentication

    private String username; // Added username for authentication purposes
}
