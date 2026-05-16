package com.swiftServe.Backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private String comment;
    private Integer rating;
    private String customerName;
    private LocalDateTime createdAt;
}
