package org.agnostic.bootstrap;

import org.agnostic.model.User;
import org.agnostic.service.UserService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by ggomes on 21-06-2014.
 */
public class DataBootstrap implements InitializingBean {

    @Autowired
    UserService userService;

    @Override
    public void afterPropertiesSet() throws Exception {
        User user = new User();
        user.setEmail("admin@admin.com");
        user.setPassword("admin");
        userService.persist(user);
    }
}
