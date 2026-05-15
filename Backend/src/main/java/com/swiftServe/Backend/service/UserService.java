package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.request.LoginRequestDto;
import com.swiftServe.Backend.dto.request.UserRegistrationRequest;
import com.swiftServe.Backend.dto.response.UserResponse;
import com.swiftServe.Backend.entity.User;

public interface UserService {
    UserResponse registerUser(UserRegistrationRequest registrationRequest);
    String login(LoginRequestDto loginRequest);

    User findUserByJwt(String jwt);
}
