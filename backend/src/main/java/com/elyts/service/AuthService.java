package com.elyts.service;

import com.elyts.model.User;
import com.elyts.repository.UserRepository;
import com.elyts.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, String> register(String email, String password, String name) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("user already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);

        userRepository.save(user);

        String token = jwtUtil.generateToken(email, user.getId());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", email);
        return response;
    }

    public Map<String, String> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("invalid credentials");
        }

        String token = jwtUtil.generateToken(email, user.getId());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", email);
        return response;
    }
}

