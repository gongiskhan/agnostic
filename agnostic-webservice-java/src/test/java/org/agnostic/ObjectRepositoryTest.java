package org.agnostic;

import org.agnostic.config.PersistenceConfig;
import org.agnostic.error.RestException;
import org.agnostic.persistence.ObjectRepository;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.ObjectUtils;
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

import java.util.HashMap;
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
        Map m = new HashMap();
        m.put("name","yeah");
        m.put("foo","bar");
        m.put("baz",5);
        objectRepository.create("obj", m);
    }

    @Test
    public void testFetch() throws Exception{
        Map m = new HashMap();
        m.put("name","yeah");
        m.put("foo","bar");
        m.put("baz",5);
        objectRepository.create("obj", m);
        Map result = objectRepository.fetch("obj",1);
        assertNotNull(result);
        assertEquals("yeah",result.get("name"));
    }

    @Test
    public void testUpdate() throws Exception{
        Map m = new HashMap();
        m.put("name","yeah");
        m.put("foo","bar");
        m.put("baz",5);
        objectRepository.create("obj", m);
        Map m2 = new HashMap();
        m2.put("name","foobar");
        objectRepository.update("obj",m2,1);
        Map result = objectRepository.fetch("obj",1);
        assertNotNull(result);
        assertEquals("foobar",result.get("name"));
    }

    @Test
    public void testFetchAll() throws Exception{
        Map m = new HashMap();
        m.put("name","yeah");
        m.put("foo","bar");
        m.put("baz",5);
        objectRepository.create("obj", m);
        Map m2 = new HashMap();
        m2.put("name","yeah2");
        m2.put("foo","bar2");
        m2.put("baz",2);
        objectRepository.create("obj", m2);
        Map m3 = new HashMap();
        m3.put("name","yeah3");
        m3.put("foo","bar3");
        m3.put("baz",3);
        objectRepository.create("obj", m3);
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

    @Test()
    public void testDelete() throws Exception{
        Map m = new HashMap();
        m.put("name","yeah");
        m.put("foo","bar");
        m.put("baz",5);
        objectRepository.create("obj", m);
        objectRepository.delete("obj",1);
        Map o = objectRepository.fetch("obj", 1);
        assertNull(o);
    }
}
