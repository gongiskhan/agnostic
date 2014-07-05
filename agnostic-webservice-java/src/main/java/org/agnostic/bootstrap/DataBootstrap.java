package org.agnostic.bootstrap;

import org.agnostic.model.User;
import org.agnostic.persistence.ObjectRepository;
import org.agnostic.service.UserService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ggomes on 21-06-2014.
 */
//@Component
public class DataBootstrap implements InitializingBean {

    @Autowired
    UserService userService;

    @Autowired
    ObjectRepository objectRepository;

    @Override
    public void afterPropertiesSet() throws Exception {

        User user = new User();
        user.setEmail("admin@admin.com");
        user.setPassword("admin");
        userService.persist(user);

        Map layoutTemplate = new HashMap();
        layoutTemplate.put("objectName","template");
        layoutTemplate.put("name","defaultLayoutTemplate");
        layoutTemplate.put("type","layout");
        layoutTemplate.put("content","CONTENT");
        layoutTemplate.put("resources",new ArrayList());
        layoutTemplate.put("engine","Underscore");
        objectRepository.create("template",layoutTemplate);

        Map menuTemplate = new HashMap();
        menuTemplate.put("objectName","template");
        menuTemplate.put("name","defaultMenuTemplate");
        menuTemplate.put("type","menu");
        menuTemplate.put("content","CONTENT");
        menuTemplate.put("resources",new ArrayList());
        menuTemplate.put("engine","Underscore");
        objectRepository.create("template",menuTemplate);

        Map componentTemplate = new HashMap();
        componentTemplate.put("objectName","template");
        componentTemplate.put("name","defaultComponentTemplate");
        componentTemplate.put("type","component");
        componentTemplate.put("content","CONTENT");
        componentTemplate.put("resources",new ArrayList());
        componentTemplate.put("engine","Underscore");
        objectRepository.create("template",componentTemplate);

        Map scriptResourceTemplate = new HashMap();
        scriptResourceTemplate.put("objectName","template");
        scriptResourceTemplate.put("name","defaultScriptResourceTemplate");
        scriptResourceTemplate.put("type","scriptResource");
        scriptResourceTemplate.put("content","<script type=\"text/javascript\" src=\"<%= resource.name %>\"></script>");
        scriptResourceTemplate.put("resources",new ArrayList());
        scriptResourceTemplate.put("engine","Underscore");
        objectRepository.create("template",scriptResourceTemplate);

        Map styleResourceTemplate = new HashMap();
        styleResourceTemplate.put("objectName","template");
        styleResourceTemplate.put("name","defaultStyleResourceTemplate");
        styleResourceTemplate.put("type","styleResource");
        styleResourceTemplate.put("content","<link rel=\"stylesheet\" type=\"text/css\" href=\"<%= resource.name %>\">");
        styleResourceTemplate.put("resources",new ArrayList());
        styleResourceTemplate.put("engine","Underscore");
        objectRepository.create("template",styleResourceTemplate);

        Map defaultDeliverable = new HashMap();
        defaultDeliverable.put("objectName","deliverable");
        defaultDeliverable.put("name","defaultDeliverable");
        defaultDeliverable.put("layoutTemplate","defaultLayoutTemplate");
        defaultDeliverable.put("menuTemplate","defaultMenuTemplate");
        defaultDeliverable.put("componentTemplate","defaultComponentTemplate");
        defaultDeliverable.put("scriptResourceTemplate","defaultScriptResourceTemplate");
        defaultDeliverable.put("styleResourceTemplate","defaultStyleResourceTemplate");
        objectRepository.create("deliverable",defaultDeliverable);

        List<String> roles = new ArrayList<String>();
        roles.add("ADMIN");
        Map defaultRole = new HashMap();
        defaultRole.put("value",roles);
        objectRepository.create("role",defaultRole);
    }
}
