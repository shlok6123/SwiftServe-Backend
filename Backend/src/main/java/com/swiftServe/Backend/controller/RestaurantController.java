package com.swiftServe.Backend.controller;

import com.swiftServe.Backend.dto.RestaurantDto;
import com.swiftServe.Backend.dto.response.ApiResponse;
import com.swiftServe.Backend.entity.Restaurant;
import com.swiftServe.Backend.service.RestaurantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/v1/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;


    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Restaurant>> createRestaurant(@Valid @RequestBody RestaurantDto dto) {
        Restaurant savedRestaurant=restaurantService.createRestaurant(dto);
        ApiResponse<Restaurant> response=new ApiResponse<>(true,"Restaurant added Successfully",savedRestaurant);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @GetMapping("/get/{id}")
    public ResponseEntity<ApiResponse<Restaurant>> getRestaurantById(@PathVariable Long id){
        Restaurant savedRestaurant=restaurantService.findById(id);
        ApiResponse<Restaurant> response=new ApiResponse<>(true,"Restaurant Found",savedRestaurant);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

@GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurant(@RequestParam String keyword){
        List<Restaurant> list=restaurantService.searchRestaurants(keyword);
        return new ResponseEntity<>(list,HttpStatus.OK);
    }
    }

