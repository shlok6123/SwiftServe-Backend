package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.request.LoginRequestDto;
import com.swiftServe.Backend.dto.request.UserRegistrationRequest;
import com.swiftServe.Backend.dto.response.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRegistrationRequest registrationRequest);
    String login(LoginRequestDto loginRequest);
}
