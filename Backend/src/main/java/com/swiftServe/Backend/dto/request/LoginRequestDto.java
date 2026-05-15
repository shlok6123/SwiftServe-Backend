package com.swiftServe.Backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDto {

    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
