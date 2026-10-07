package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.request.LoginRequestDto;
import com.swiftServe.Backend.dto.request.UserRegistrationRequest;
import com.swiftServe.Backend.dto.request.UpdateProfileRequest;
import com.swiftServe.Backend.dto.response.UserResponse;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.exception.BusinessException;
import com.swiftServe.Backend.exception.ResourceNotFoundException;
import com.swiftServe.Backend.exception.UnauthorizedException;
import com.swiftServe.Backend.repository.UserRepo;
import com.swiftServe.Backend.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            log.info("User Already Exists: {}",request.getEmail());
            throw new BusinessException("An account with this email already exists");
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
        User user = userRepo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.warn("Failed login attempt for email: {}", loginRequest.getEmail());
            throw new UnauthorizedException("Invalid email or password");
        }
        return jwtUtil.generateToken(user.getEmail());
    }

    @Override
    public User findUserByJwt(String jwt) {
        String email = jwtUtil.extractEmail(jwt);
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    public UserResponse updateProfile(String jwt, UpdateProfileRequest request) {
        User user = findUserByJwt(jwt);

        // Check if email is being changed and if it already exists
        if (!user.getEmail().equals(request.getEmail()) && userRepo.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email is already in use by another account");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        User updatedUser = userRepo.save(user);

        UserResponse response = new UserResponse();
        response.setId(updatedUser.getId());
        response.setName(updatedUser.getName());
        response.setEmail(updatedUser.getEmail());
        response.setUserRole(updatedUser.getUserRole());
        return response;
    }
}
