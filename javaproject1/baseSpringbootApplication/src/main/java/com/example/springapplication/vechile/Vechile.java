package com.example.springapplication.vechile;

public class Vechile {
    private String name;  // ✅ Add missing field

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {  // ✅ Getter for name
        return name;
    }
}
