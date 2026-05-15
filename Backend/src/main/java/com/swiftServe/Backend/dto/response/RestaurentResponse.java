package com.swiftServe.Backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestaurentResponse {
    private Long id;
    private String name;
    private String cuisineType;
    private String contactNumber;
    private Double rating;
    private boolean isOpen;


}
