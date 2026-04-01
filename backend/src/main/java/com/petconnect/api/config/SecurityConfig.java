package com.petconnect.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.csrf(csrf -> csrf.disable()) // Désactive la protection CSRF pour tester l'API facilement
				.authorizeHttpRequests(auth -> auth
						.anyRequest().permitAll() // Autorise TOUTES les requêtes sans login
				)
				.headers(headers -> headers.frameOptions(frame -> frame.disable())); // Utile si tu utilises la console
																						// H2 plus tard

		return http.build();
	}
}