package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.request.UserRegistrationRequest;
import com.swiftServe.Backend.dto.response.UserResponse;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;

    public UserServiceImpl(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public UserResponse registerUser(UserRegistrationRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User is already present");
        }
        User user=new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setUserRole(request.getUserRole());
        user.setPassword(request.getPassword());

        User savedUser=userRepo.save(user);

        UserResponse response=new UserResponse();
        response.setId(savedUser.getId());
        response.setUserRole(savedUser.getUserRole());
        response.setEmail(savedUser.getEmail());

        return response;
    }
}

