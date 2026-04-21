package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.request.LoginRequestDto;
import com.swiftServe.Backend.dto.request.UserRegistrationRequest;
import com.swiftServe.Backend.dto.response.UserResponse;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.repository.UserRepo;
import com.swiftServe.Backend.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepo userRepo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public UserResponse registerUser(UserRegistrationRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            log.info("User Already Exists",request.getEmail());
            throw new RuntimeException("User is already present");
        }
        User user=new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setUserRole(request.getUserRole());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser=userRepo.save(user);
        log.info("User Saved with id: "+user.getId());

        UserResponse response=new UserResponse();
        response.setId(savedUser.getId());
        response.setUserRole(savedUser.getUserRole());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        return response;
    }

    @Override
    public String login(LoginRequestDto loginRequest) {
        User user=userRepo.findByEmail(loginRequest.getEmail()).orElseThrow(()->new RuntimeException("User Not Found"));

        if(!passwordEncoder.matches(loginRequest.getPassword(),user.getPassword())){
            log.warn("Invalid Email or Password");
            throw new RuntimeException("Invalid Email or Passowrd");
        }
        return jwtUtil.generateToken(user.getEmail());
    }
}

