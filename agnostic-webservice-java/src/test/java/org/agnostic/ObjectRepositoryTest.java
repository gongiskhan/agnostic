package org.agnostic;

import org.agnostic.config.PersistenceConfig;
import org.agnostic.persistence.ObjectRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;

/**
 * Created by ggomes on 05-06-2014.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {PersistenceConfig.class})
@TransactionConfiguration(defaultRollback=false)
public class ObjectRepositoryTest extends AbstractTransactionalJUnit4SpringContextTests {

    @Autowired
    ObjectRepository objectRepository;

    @Before
    public void dropDatabase() throws Exception{
        objectRepository.dropDatabase();
    }

    @Test
    public void testCreate() throws Exception{
        Object obj = new Object(){
            public String name = "yeah";
            public String foo = "bar";
            public int baz = 5;
        };
        objectRepository.create("obj",obj);
    }

    @Test
    public void testFetch() throws Exception{
        Object obj = new Object(){
            public String name = "yeah";
            public String foo = "bar";
            public int baz = 5;
        };
        objectRepository.create("obj",obj);
        Map result = objectRepository.fetch("obj",1);
        assertNotNull(result);
        assertEquals("yeah",result.get("name"));
    }

    @Test
    public void testUpdate() throws Exception{
        Object obj = new Object(){
            public String name = "yeah";
            public String foo = "bar";
            public int baz = 5;
        };
        objectRepository.create("obj",obj);
        Object obj2 = new Object(){
            public String name = "foobar";
        };
        objectRepository.update("obj",obj2,1);
        Map result = objectRepository.fetch("obj",1);
        assertNotNull(result);
        assertEquals("foobar",result.get("name"));
    }

    @Test
    public void testFetchAll() throws Exception{
        Object obj = new Object(){
            public String name = "yeah";
            public String foo = "bar";
            public int baz = 5;
        };
        objectRepository.create("obj",obj);
        Object obj2 = new Object(){
            public String name = "yeah2";
            public String foo = "bar2";
            public int baz = 2;
        };
        objectRepository.create("obj",obj2);
        Object obj3 = new Object(){
            public String name = "yeah3";
            public String foo = "bar3";
            public int baz = 3;
        };
        objectRepository.create("obj",obj3);
        List<Map> result = objectRepository.fetchAll("obj");
        assertEquals(3,result.size());
        assertEquals("yeah",result.get(0).get("name"));
        assertEquals("yeah2",result.get(1).get("name"));
        assertEquals("yeah3",result.get(2).get("name"));
        assertEquals("bar",result.get(0).get("foo"));
        assertEquals("bar2",result.get(1).get("foo"));
        assertEquals("bar3",result.get(2).get("foo"));
        assertEquals(5,result.get(0).get("baz"));
        assertEquals(2,result.get(1).get("baz"));
        assertEquals(3,result.get(2).get("baz"));
    }

    @Test
    public void testDelete() throws Exception{
        Object obj = new Object(){
            public String name = "yeah";
            public String foo = "bar";
            public int baz = 5;
        };
        objectRepository.create("obj",obj);
        objectRepository.delete("obj",1);
        Map result = objectRepository.fetch("obj",1);
        assertNull(result);
    }
}
