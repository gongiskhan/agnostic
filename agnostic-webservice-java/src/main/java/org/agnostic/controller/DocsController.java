package org.agnostic.controller;

import com.mangofactory.swagger.annotations.ApiIgnore;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * User Class.
 * User: ggomes
 */
@Controller
public class DocsController {

    @ApiIgnore
    @RequestMapping("/apidocs")
    public String render(){
        return "index";
    }
}
