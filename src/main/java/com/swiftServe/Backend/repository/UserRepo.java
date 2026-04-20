package com.swiftServe.Backend.repository;

import com.swiftServe.Backend.entity.User;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean exsitsByEmail(String email);
}
