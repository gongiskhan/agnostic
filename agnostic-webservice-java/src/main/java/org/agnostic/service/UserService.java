package org.agnostic.service;

import org.agnostic.error.RestException;
import org.agnostic.model.User;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.io.UnsupportedEncodingException;
import java.security.GeneralSecurityException;
import java.util.List;

/**
 * User: ggomes
 * Date: 08-10-2013
 * Time: 19:03
 * To change this template use File | Settings | File Templates.
 */
public interface UserService extends UserDetailsService, AuthenticationUserDetailsService {
    User persist(User user) throws UnsupportedEncodingException, GeneralSecurityException, RestException;

    User fetch(Long id);

    User fetchByEmail(String username);

    List<User> fetchAll();

    User delete(Long id);
}
