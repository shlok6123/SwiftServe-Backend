package com.swiftServe.Backend.config;

import com.swiftServe.Backend.entity.MenuItem;
import com.swiftServe.Backend.entity.Restaurant;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.entity.UserRole;
import com.swiftServe.Backend.repository.MenuItemRepo;
import com.swiftServe.Backend.repository.RestaurantRepo;
import com.swiftServe.Backend.repository.UserRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@Profile("!prod")
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepo userRepo;
    private final RestaurantRepo restaurantRepo;
    private final MenuItemRepo menuItemRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepo userRepo,
                          RestaurantRepo restaurantRepo,
                          MenuItemRepo menuItemRepo,
                          BCryptPasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.restaurantRepo = restaurantRepo;
        this.menuItemRepo = menuItemRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepo.count() == 0) {
            log.info("Database is empty. Initiating automatic data seeding...");

            // 1. Create default users
            User customer = new User();
            customer.setEmail("customer@gmail.com");
            customer.setName("Jane Customer");
            customer.setPassword(passwordEncoder.encode("securepassword"));
            customer.setUserRole(UserRole.CUSTOMER);
            userRepo.save(customer);

            User owner = new User();
            owner.setEmail("owner@gmail.com");
            owner.setName("John Owner");
            owner.setPassword(passwordEncoder.encode("securepassword"));
            owner.setUserRole(UserRole.RESTAURANT_OWNER);
            userRepo.save(owner);

            User driver = new User();
            driver.setEmail("driver@gmail.com");
            driver.setName("David Driver");
            driver.setPassword(passwordEncoder.encode("securepassword"));
            driver.setUserRole(UserRole.DRIVER);
            userRepo.save(driver);

            User admin = new User();
            admin.setEmail("admin@gmail.com");
            admin.setName("Alice Admin");
            admin.setPassword(passwordEncoder.encode("securepassword"));
            admin.setUserRole(UserRole.ADMIN);
            userRepo.save(admin);

            log.info("Successfully seeded 4 default users (customer@gmail.com, owner@gmail.com, driver@gmail.com, admin@gmail.com). Password is: securepassword");

            // 2. Create default restaurants
            Restaurant pizzaPlanet = new Restaurant();
            pizzaPlanet.setName("Pizza Planet");
            pizzaPlanet.setAddress("123 Orbit Ave, New York");
            pizzaPlanet.setContactNumber("1234567890");
            pizzaPlanet.setDescription("Out of this world hand-tossed pizzas and italian sides!");
            pizzaPlanet.setImageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60");
            pizzaPlanet.setCuisine("Italian");
            pizzaPlanet.setRating(4.8);
            pizzaPlanet.setOwner(owner);
            pizzaPlanet.setIsOpen(true);
            restaurantRepo.save(pizzaPlanet);

            Restaurant burgerTown = new Restaurant();
            burgerTown.setName("Burger Town");
            burgerTown.setAddress("456 Grid St, Chicago");
            burgerTown.setContactNumber("0987654321");
            burgerTown.setDescription("Home of the double cheeseburger, spicy chicken burgers, and golden fries!");
            burgerTown.setImageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60");
            burgerTown.setCuisine("American");
            burgerTown.setRating(4.5);
            burgerTown.setOwner(owner);
            burgerTown.setIsOpen(true);
            restaurantRepo.save(burgerTown);

            Restaurant pandaGarden = new Restaurant();
            pandaGarden.setName("Panda Garden");
            pandaGarden.setAddress("789 Bamboo Ln, San Francisco");
            pandaGarden.setContactNumber("1122334455");
            pandaGarden.setDescription("Fresh, hot, and authentic Chinese dishes served daily.");
            pandaGarden.setImageUrl("https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60");
            pandaGarden.setCuisine("Chinese");
            pandaGarden.setRating(4.2);
            pandaGarden.setOwner(owner);
            pandaGarden.setIsOpen(true);
            restaurantRepo.save(pandaGarden);

            log.info("Successfully seeded 3 default restaurants (Pizza Planet, Burger Town, Panda Garden).");

            // 3. Create default menu items
            // Pizza Planet Items
            MenuItem pepperoni = new MenuItem();
            pepperoni.setName("Pepperoni Feast");
            pepperoni.setDescription("Double pepperoni, tomato sauce, and extra mozzarella cheese.");
            pepperoni.setCategory("Main Course");
            pepperoni.setPrice(BigDecimal.valueOf(14.99));
            pepperoni.setImageUrl("https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60");
            pepperoni.setIsVeg(false);
            pepperoni.setIsAvailable(true);
            pepperoni.setCreatedAt(LocalDateTime.now());
            pepperoni.setRestaurant(pizzaPlanet);
            menuItemRepo.save(pepperoni);

            MenuItem margherita = new MenuItem();
            margherita.setName("Margherita Classic");
            margherita.setDescription("Fresh organic basil, ripe tomatoes, and fresh mozzarella.");
            margherita.setCategory("Main Course");
            margherita.setPrice(BigDecimal.valueOf(12.99));
            margherita.setImageUrl("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60");
            margherita.setIsVeg(true);
            margherita.setIsAvailable(true);
            margherita.setCreatedAt(LocalDateTime.now());
            margherita.setRestaurant(pizzaPlanet);
            menuItemRepo.save(margherita);

            MenuItem garlicKnots = new MenuItem();
            garlicKnots.setName("Garlic Knot Bread");
            garlicKnots.setDescription("Freshly baked dough knots coated in garlic butter, parsley, and parmesan.");
            garlicKnots.setCategory("Appetizers");
            garlicKnots.setPrice(BigDecimal.valueOf(5.99));
            garlicKnots.setImageUrl("https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&auto=format&fit=crop&q=60");
            garlicKnots.setIsVeg(true);
            garlicKnots.setIsAvailable(true);
            garlicKnots.setCreatedAt(LocalDateTime.now());
            garlicKnots.setRestaurant(pizzaPlanet);
            menuItemRepo.save(garlicKnots);

            // Burger Town Items
            MenuItem doubleCheese = new MenuItem();
            doubleCheese.setName("Classic Double Cheeseburger");
            doubleCheese.setDescription("Two premium beef patties, melted cheddar, pickles, and signature burger sauce.");
            doubleCheese.setCategory("Main Course");
            doubleCheese.setPrice(BigDecimal.valueOf(9.99));
            doubleCheese.setImageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60");
            doubleCheese.setIsVeg(false);
            doubleCheese.setIsAvailable(true);
            doubleCheese.setCreatedAt(LocalDateTime.now());
            doubleCheese.setRestaurant(burgerTown);
            menuItemRepo.save(doubleCheese);

            MenuItem chickenBurger = new MenuItem();
            chickenBurger.setName("Spicy Chicken Burger");
            chickenBurger.setDescription("Crispy chicken breast, jalapeños, lettuce, and spicy chipotle mayonnaise.");
            chickenBurger.setCategory("Main Course");
            chickenBurger.setPrice(BigDecimal.valueOf(10.99));
            chickenBurger.setImageUrl("https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=60");
            chickenBurger.setIsVeg(false);
            chickenBurger.setIsAvailable(true);
            chickenBurger.setCreatedAt(LocalDateTime.now());
            chickenBurger.setRestaurant(burgerTown);
            menuItemRepo.save(chickenBurger);

            MenuItem fries = new MenuItem();
            fries.setName("Golden French Fries");
            fries.setDescription("Crispy, salted, and golden brown crinkle-cut fries.");
            fries.setCategory("Sides");
            fries.setPrice(BigDecimal.valueOf(3.49));
            fries.setImageUrl("https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60");
            fries.setIsVeg(true);
            fries.setIsAvailable(true);
            fries.setCreatedAt(LocalDateTime.now());
            fries.setRestaurant(burgerTown);
            menuItemRepo.save(fries);

            // Panda Garden Items
            MenuItem kungPao = new MenuItem();
            kungPao.setName("Kung Pao Chicken");
            kungPao.setDescription("Spicy stir-fried diced chicken with toasted peanuts, bell peppers, and chili.");
            kungPao.setCategory("Main Course");
            kungPao.setPrice(BigDecimal.valueOf(13.99));
            kungPao.setImageUrl("https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60");
            kungPao.setIsVeg(false);
            kungPao.setIsAvailable(true);
            kungPao.setCreatedAt(LocalDateTime.now());
            kungPao.setRestaurant(pandaGarden);
            menuItemRepo.save(kungPao);

            MenuItem springRolls = new MenuItem();
            springRolls.setName("Crispy Veg Spring Rolls");
            springRolls.setDescription("Four golden crispy wrappers stuffed with seasoned shredded vegetables.");
            springRolls.setCategory("Appetizers");
            springRolls.setPrice(BigDecimal.valueOf(4.99));
            springRolls.setImageUrl("https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60");
            springRolls.setIsVeg(true);
            springRolls.setIsAvailable(true);
            springRolls.setCreatedAt(LocalDateTime.now());
            springRolls.setRestaurant(pandaGarden);
            menuItemRepo.save(springRolls);

            log.info("Successfully seeded 8 default menu items across restaurants.");
            log.info("Data seeding operation complete.");
        } else {
            log.info("Database contains existing records. Skipping data seeding.");
        }
    }
}
