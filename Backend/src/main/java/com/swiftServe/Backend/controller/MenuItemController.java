package com.swiftServe.Backend.controller;

import com.swiftServe.Backend.dto.MenuItemDto;
import com.swiftServe.Backend.dto.response.ApiResponse;
import com.swiftServe.Backend.entity.MenuItem;
import com.swiftServe.Backend.service.MenuService;
import com.swiftServe.Backend.service.MenuServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/Menu")
public class MenuItemController {

    private final MenuService menuService;

    public MenuItemController(MenuService menuService) {
        this.menuService = menuService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<MenuItem>> addMenu(@Valid @RequestBody MenuItemDto dto){
        MenuItem menuItem=menuService.addItem(dto);
        ApiResponse<MenuItem> response=new ApiResponse<>(true,"Item Added Succesfully",menuItem);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
