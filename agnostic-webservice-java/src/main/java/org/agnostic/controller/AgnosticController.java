package org.agnostic.controller;

import org.agnostic.persistence.ObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value={"/agnostic"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class AgnosticController {

    @Autowired
    ObjectRepository repository;

    @RequestMapping(value = {"/{objectName}"}, method = RequestMethod.GET)
    public ResponseEntity<List<Map>> list(@PathVariable("objectName") String objectName) throws Exception{
        return new ResponseEntity<>(repository.fetchAll(objectName), HttpStatus.OK);
    }

    @RequestMapping(value = {"/{objectName}"}, params = {"id"}, method = RequestMethod.GET)
    public ResponseEntity<Map> get(@PathVariable("objectName") String objectName, @RequestParam Integer id) throws Exception{
        return new ResponseEntity<>(repository.fetch(objectName, id),HttpStatus.OK);
    }

    @RequestMapping(value = {"/{objectName}"}, method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity create(@PathVariable("objectName") String objectName, @RequestBody Map object) throws Exception{
        repository.create(objectName, object);
        return new ResponseEntity(HttpStatus.CREATED);
    }

    @RequestMapping(value = {"/{objectName}"}, method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity update(@PathVariable("objectName") String objectName, @RequestBody Map object) throws Exception{
        repository.update(objectName, object, Integer.parseInt((String)object.get("id")));
        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(value = {"/{objectName}"}, method = RequestMethod.DELETE)
    public ResponseEntity delete(HttpServletResponse response, @PathVariable("objectName") String objectName, @RequestParam("id") Integer id) throws Exception{
        repository.delete(objectName, id);
        return new ResponseEntity(HttpStatus.OK);
    }

}
