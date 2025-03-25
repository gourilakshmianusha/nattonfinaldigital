package com.example.springapplication.vechile;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration  // ✅ Marks this class as a Spring configuration
public class VechileConfig {

    @Bean  // ✅ Defines a Spring-managed bean
    public Vechile vehicle() {
        Vechile veh = new Vechile();
        veh.setName("Audi 8");
        return veh;  // ✅ Returns a Vechile instance
    }
}
