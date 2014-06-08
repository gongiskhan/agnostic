package org.agnostic.persistence;


import org.agnostic.model.User;
import org.springframework.data.repository.CrudRepository;

/**
 * UserRepository Class.
 * User: ggomes
 */
public interface UserRepository extends CrudRepository<User, Long> {
    public User findUserByEmail(String email);
}
