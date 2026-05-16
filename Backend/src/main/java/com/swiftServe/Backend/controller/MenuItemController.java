package com.swiftServe.Backend.controller;

import com.swiftServe.Backend.dto.MenuItemDto;
import com.swiftServe.Backend.dto.response.ApiResponse;
import com.swiftServe.Backend.entity.MenuItem;
import com.swiftServe.Backend.service.MenuService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/Menu")
public class MenuItemController {

    private final MenuService menuService;

    public MenuItemController(MenuService menuService) {
        this.menuService = menuService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<MenuItem>> addMenu(@Valid @RequestBody MenuItemDto dto) {
        MenuItem menuItem = menuService.addItem(dto);
        ApiResponse<MenuItem> response = new ApiResponse<>(true, "Item Added Successfully", menuItem);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<MenuItem>> updateMenu(@PathVariable Long id,
                                                             @Valid @RequestBody MenuItemDto dto) {
        MenuItem menuItem = menuService.updateItem(id, dto);
        ApiResponse<MenuItem> response = new ApiResponse<>(true, "Item Updated Successfully", menuItem);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<String>> deleteMenu(@PathVariable Long id) {
        menuService.deleteItem(id);
        ApiResponse<String> response = new ApiResponse<>(true, "Item Deleted Successfully", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/toggle/{id}")
    public ResponseEntity<ApiResponse<MenuItem>> toggleAvailability(@PathVariable Long id) {
        MenuItem menuItem = menuService.toggleAvailability(id);
        ApiResponse<MenuItem> response = new ApiResponse<>(true, 
            "Item availability toggled to: " + (menuItem.getIsAvailable() ? "Available" : "Unavailable"), 
            menuItem);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
