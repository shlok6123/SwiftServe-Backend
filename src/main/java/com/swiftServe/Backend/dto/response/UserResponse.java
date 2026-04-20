package com.swiftServe.Backend.dto.response;

import com.swiftServe.Backend.entity.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private UserRole userRole;
}
