package com.example.springapplication;

import com.example.springapplication.vechile.Vechile;
import com.example.springapplication.vechile.VechileConfig;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class MainApp {
    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(VechileConfig.class);

        Vechile myVehicle = context.getBean(Vechile.class);
        System.out.println("Vehicle Name: " + myVehicle.getName());  // ✅ Output: Vehicle Name: Audi 8
    }
}
