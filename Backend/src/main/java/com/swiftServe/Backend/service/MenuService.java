package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.MenuItemDto;
import com.swiftServe.Backend.entity.MenuItem;

public interface MenuService {

    public MenuItem addItem(MenuItemDto dto);
    public MenuItem updateItem(Long id, MenuItemDto dto);
    public void deleteItem(Long id);
    public MenuItem toggleAvailability(Long id);
}
