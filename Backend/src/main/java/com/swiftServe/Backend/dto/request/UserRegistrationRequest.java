package com.swiftServe.Backend.dto.request;

import com.swiftServe.Backend.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserRegistrationRequest {

    @NotBlank(message = "Name can not be empty")
    private String name;

    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotNull
    @Size(min = 6,message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "role is required: ")
    private UserRole userRole;



}
