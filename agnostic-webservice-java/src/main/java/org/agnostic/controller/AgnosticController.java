package org.agnostic.controller;

import org.agnostic.error.RestException;
import org.agnostic.persistence.ObjectRepository;
import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value={"/agnostic"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class AgnosticController {

    @Autowired
    ObjectRepository repository;

    @RequestMapping(value = {"/{objectName}"}, method = RequestMethod.GET)
    public ResponseEntity list(@PathVariable("objectName") String objectName, HttpServletRequest request) throws Exception{
        try{
            List<Map> objects = repository.fetchAll(objectName);
            Map projection = request.getParameterMap();
            if(projection != null && projection.size() > 0){
                List<Map> filteredObjects = new ArrayList<Map>();
                for(Map object : objects){
                    for(Object keyObj : projection.keySet()){
                        String key = (String)keyObj;
                        if(object.get(key) != null && object.get(key).equals(projection.get(key))){
                            filteredObjects.add(object);
                            break;
                        }
                    }
                }
                objects = filteredObjects;
            }

            return new ResponseEntity<List<Map>>(objects, HttpStatus.OK);
        }catch (RestException rex){
            return new ResponseEntity<RestException>(rex, HttpStatus.valueOf(rex.getErrorCode().getValue()));
        }
    }

    @RequestMapping(value = {"/{objectName}"}, params = {"id"}, method = RequestMethod.GET)
    public ResponseEntity get(@PathVariable("objectName") String objectName, @RequestParam Integer id, @RequestParam(required = false) String property) throws Exception{
        try{
            Map object = repository.fetch(objectName, id);
            if(property != null && !property.isEmpty()){
                return new ResponseEntity<Object>(PropertyUtils.getProperty(object,property), HttpStatus.OK);
            }else{
                return new ResponseEntity<Map>(object, HttpStatus.OK);
            }
        }catch (RestException rex){
            return new ResponseEntity<RestException>(rex, HttpStatus.valueOf(rex.getErrorCode().getValue()));
        }
    }

    @RequestMapping(value = {"/{objectName}"}, method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity create(@PathVariable("objectName") String objectName, @RequestBody Map object) throws Exception{
        try{
            return new ResponseEntity<Map>(repository.create(objectName, object), HttpStatus.OK);
        }catch (RestException rex){
            return new ResponseEntity<RestException>(rex, HttpStatus.valueOf(rex.getErrorCode().getValue()));
        }
    }

    @RequestMapping(value = {"/{objectName}"}, method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity update(@PathVariable("objectName") String objectName, @RequestBody Map object) throws Exception{
        try{
            Integer id = Integer.class.isInstance(object.get("id")) ? (Integer)object.get("id") : Integer.parseInt((String)object.get("id"));
            return new ResponseEntity<Map>(repository.update(objectName, object, id), HttpStatus.OK);
        }catch (RestException rex){
            return new ResponseEntity<RestException>(rex, HttpStatus.valueOf(rex.getErrorCode().getValue()));
        }
    }

    @RequestMapping(value = {"/{objectName}"}, method = RequestMethod.DELETE)
    public ResponseEntity delete(HttpServletResponse response, @PathVariable("objectName") String objectName, @RequestParam("id") Integer id) throws Exception{
        try{
            repository.delete(objectName, id);
            return new ResponseEntity<Map>(HttpStatus.OK);
        }catch (RestException rex){
            return new ResponseEntity<RestException>(rex, HttpStatus.valueOf(rex.getErrorCode().getValue()));
        }
    }

}
