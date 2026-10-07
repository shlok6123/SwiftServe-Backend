package com.swiftServe.Backend.controller;

import com.swiftServe.Backend.dto.request.LoginRequestDto;
import com.swiftServe.Backend.dto.request.UserRegistrationRequest;
import com.swiftServe.Backend.dto.request.UpdateProfileRequest;
import com.swiftServe.Backend.dto.response.ApiResponse;
import com.swiftServe.Backend.dto.response.UserResponse;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
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


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody LoginRequestDto loginRequest){
        String token=userService.login(loginRequest);
        return  ResponseEntity.ok(new ApiResponse<>(true,"Login Successfull",token));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@RequestHeader("Authorization") String jwt) {
        String token = jwt.startsWith("Bearer ") ? jwt.substring(7) : jwt;
        User user = userService.findUserByJwt(token);
        
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setUserRole(user.getUserRole());
        
        return new ResponseEntity<>(new ApiResponse<>(true, "Profile fetched", response), HttpStatus.OK);
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody UpdateProfileRequest request) {
        String token = jwt.startsWith("Bearer ") ? jwt.substring(7) : jwt;
        UserResponse updatedProfile = userService.updateProfile(token, request);
        return new ResponseEntity<>(new ApiResponse<>(true, "Profile updated successfully", updatedProfile), HttpStatus.OK);
    }
}
