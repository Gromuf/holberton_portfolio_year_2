package com.petconnect.api.security;

import com.petconnect.api.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {

	private Long id;
	private String email;
	private String name;

	@JsonIgnore
	private String password;

	public UserDetailsImpl(Long id, String email, String password, String name) {
		this.id = id;
		this.email = email;
		this.password = password;
		this.name = name;
	}

	public static UserDetailsImpl build(User user) {
		return new UserDetailsImpl(
				user.getId(),
				user.getEmail(),
				user.getPassword(),
				user.getName());
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(); // No roles or authorities for now
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() { // Using email now but old method name was getUsername so we keep it for compatibility with Spring Security
		return email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}
}