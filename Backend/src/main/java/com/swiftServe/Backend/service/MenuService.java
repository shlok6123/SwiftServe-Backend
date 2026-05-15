package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.MenuItemDto;
import com.swiftServe.Backend.entity.MenuItem;

public interface MenuService {

    public MenuItem addItem(MenuItemDto dto);
}
