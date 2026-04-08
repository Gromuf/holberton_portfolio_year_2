package com.petconnect.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.petconnect.api.security.AuthTokenFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				// Mode "Stateless" : on ne stocke pas de session côté serveur
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						// On laisse l'accès libre pour s'enregistrer et se connecter
						.requestMatchers("/api/auth/**").permitAll()
						// On laisse Swagger accessible pour la doc
						.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
						// Tout le reste est protégé
						.anyRequest().authenticated())
				.headers(headers -> headers.frameOptions(frame -> frame.disable()));
		http.addFilterBefore(authenticationJwtTokenFilter(), org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	// Indispensable pour hacher les mots de passe
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// Nécessaire pour gérer l'authentification plus tard
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}