package org.clickcarwl.userservice.userserviceapplication.entities;

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

    private String password;

    private String username;

    public CharSequence getPassword() {
        return password;
    }
    
    public String getUsername() {
        return username;
    }
    



}