package org.agnostic.persistence;

import org.agnostic.error.ExceptionFactory;
import org.agnostic.error.RestException;
import org.agnostic.util.JSONUtil;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ObjectRepository {

    @Autowired
    DataSource dataSource;
    @Autowired
    JSONUtil jsonUtil;
    @Autowired
    ExceptionFactory exceptionFactory;

    public Map create(String objectName, Map object) throws SQLException, IOException, RestException {
        Connection con = null;
        PreparedStatement ps = null;
        try{
            con = dataSource.getConnection();
            //Create table if not exists
            ps = con.prepareStatement("CREATE TABLE IF NOT EXISTS "+objectName+"(ID int IDENTITY(1,1) PRIMARY KEY, JSON CLOB);");
            ps.executeUpdate();
            //Insert object
            ps = con.prepareStatement("insert into "+objectName+" (json) values (?);");
            ps.setClob(1, new StringReader(jsonUtil.toJSON(object)));
            ps.executeUpdate();
            Statement idS = con.createStatement();
            ResultSet rs = idS.executeQuery("select IDENTITY();");
            rs.next();
            object.put("id",rs.getInt(1));
            return object;
        }catch(Exception ex){
            ex.printStackTrace();
            throw exceptionFactory.createException(ex);
        }finally{
            try {
                if(ps != null)
                ps.close();
                if(con != null)
                con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public Map fetch(String objectName, int id) throws SQLException, IOException, RestException {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        Map value = null;
        try {
            con = dataSource.getConnection();
            ps = con.prepareStatement("select id, json from " + objectName + " where id = ?;");
            ps.setInt(1, id);
            rs = ps.executeQuery();
            if(rs.next()){
                Integer theId = rs.getInt(1);
                Clob clob = rs.getClob(2);
                if (clob != null) {
                    InputStream in = clob.getAsciiStream();
                    StringWriter w = new StringWriter();
                    IOUtils.copy(in, w);
                    String clobAsString = w.toString();
                    value = (Map) jsonUtil.fromJSON(clobAsString, Map.class);
                    for(Object obj : value.entrySet()){
                        Map.Entry ent = (Map.Entry)obj;
                        if(ent.getValue() != null && ent.getValue().getClass().isAssignableFrom(ArrayList.class)){
                            List list = (ArrayList)ent.getValue();
                            List newList = new ArrayList();
                            for(Object listObj : list){
                                if(Map.class.isAssignableFrom(listObj.getClass())){
                                    Map mapListObj = (Map)listObj;
                                    String listObjName = (String) mapListObj.get("objectName");
                                    if(listObjName != null){
                                        int idInt = mapListObj.get("id").getClass().equals(String.class) ? Integer.parseInt((String)mapListObj.get("id")) : (int)mapListObj.get("id");
                                        Map fromDB = fetch(listObjName,idInt);
                                        newList.add(fromDB);
                                    }else{
                                        newList.add(mapListObj);
                                    }
                                }
                                else{
                                    newList.add(listObj);
                                }
                            }
                            value.put(ent.getKey(), newList);
                        }
                    }
                    value.put("id",theId);
                }
            }
        }catch(Exception ex){
            ex.printStackTrace();
            throw exceptionFactory.createException(ex);
        } finally{
            try {
                if(ps != null)
                ps.close();
                if(con != null)
                con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return value;
    }

    public List<Map> fetchAll(String objectName) throws SQLException, IOException, RestException {
        Connection con = null;
        Statement ps = null;
        ResultSet rs = null;
        List<Map> value = new ArrayList<Map>();
        try {
            con = dataSource.getConnection();
            ps = con.createStatement();
            rs = ps.executeQuery("select id, json from " + objectName + ";");
            while (rs.next()) {
                Integer theId = rs.getInt(1);
                Clob clob = rs.getClob(2);
                if (clob != null) {
                    InputStream in = clob.getAsciiStream();
                    StringWriter w = new StringWriter();
                    IOUtils.copy(in, w);
                    String clobAsString = w.toString();
                    Map val = (Map) jsonUtil.fromJSON(clobAsString, Map.class);
                    for(Object obj : val.entrySet()){
                        Map.Entry ent = (Map.Entry)obj;
                        if(ent.getValue() != null && ent.getValue().getClass().isAssignableFrom(ArrayList.class)){
                            List list = (ArrayList)ent.getValue();
                            List newList = new ArrayList();
                            for(Object listObj : list){
                                if(Map.class.isAssignableFrom(listObj.getClass())){
                                    Map mapListObj = (Map)listObj;
                                    String listObjName = (String) mapListObj.get("objectName");
                                    if(listObjName != null){
                                        int idInt = mapListObj.get("id").getClass().equals(String.class) ? Integer.parseInt((String)mapListObj.get("id")) : (int)mapListObj.get("id");
                                        Map fromDB = fetch(listObjName,idInt);
                                        if (fromDB != null)
                                            newList.add(fromDB);
                                    }else{
                                        newList.add(mapListObj);
                                    }
                                }
                                else{
                                    newList.add(listObj);
                                }
                            }
                            val.put(ent.getKey(), newList);
                        }
                    }
                    val.put("id",theId);
                    value.add(val);
                }
            }
        }
        catch(Exception ex){
            ex.printStackTrace();
            throw exceptionFactory.createException(ex);
        } finally{
            try {
                if(ps != null)
                ps.close();
                if(con != null)
                con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return value;
    }

    public Map update(String objectName, Map object, int id) throws SQLException, IOException, RestException {
        Connection con = null;
        PreparedStatement ps = null;
        try{
            con = dataSource.getConnection();
            ps = con.prepareStatement("update " + objectName + " set json = ? where id = ?");
            ps.setClob(1, new StringReader(jsonUtil.toJSON(object)));
            ps.setInt(2, id);
            ps.executeUpdate();
            object.put("id",id);
            return object;
        }catch(Exception ex){
            ex.printStackTrace();
            throw exceptionFactory.createException(ex);
        }finally {
            try {
                if(ps != null)
                    ps.close();
                if(con != null)
                    con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public void delete(String objectName, int id) throws SQLException, IOException, RestException {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        Map value = null;
        try{
            con = dataSource.getConnection();
            ps = con.prepareStatement("delete from " + objectName + " where id = ?;");
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch(Exception ex){
            ex.printStackTrace();
            throw exceptionFactory.createException(ex);
        }finally{
            try {
                ps.close();
                con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public void dropDatabase() throws SQLException, RestException {
        Connection con = null;
        Statement st = null;
        try{
            con = dataSource.getConnection();
            st = con.createStatement();
            ResultSet rs=st.executeQuery("show tables");
            StringBuffer dropTablesSB = new StringBuffer();
            dropTablesSB.append("SET FOREIGN_KEY_CHECKS = 0;\n");
            while(rs.next()) {
                String tableName=rs.getString(1);
                dropTablesSB.append("DROP TABLE "+tableName+";\n");
            }
            dropTablesSB.append("SET FOREIGN_KEY_CHECKS = 0;\n");
            st.executeUpdate(dropTablesSB.toString());
        } catch(Exception ex){
            ex.printStackTrace();
            throw exceptionFactory.createException(ex);
        }finally{
            try {
                st.close();
                con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

}
