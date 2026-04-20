package com.swiftServe.Backend.controller;

import com.swiftServe.Backend.dto.request.UserRegistrationRequest;
import com.swiftServe.Backend.dto.response.ApiResponse;
import com.swiftServe.Backend.dto.response.UserResponse;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserRegistrationRequest request){

        UserResponse user=userService.registerUser(request);

        ApiResponse<UserResponse> response=new ApiResponse<>(true,"User Registerd Successfully",user);

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }
}
