package org.agnostic.util;

import java.util.ArrayList;
import java.util.List;

/**
 * CollectionUtils Class.
 * User: ggomes
 * Date: 26/08/13
 * Time: 10:27
 */
public class CollectionUtils {

    public static List removeDuplicates(List ... lists){

        List<Object> all = new ArrayList<Object>();
        for(List list : lists){
            all.addAll(list);
        }

        for(List list : lists){
            List<Integer> positionsToRemove = new ArrayList<Integer>();
            int count = 0;
            for(Object o : list){
                if(org.apache.commons.collections.CollectionUtils.cardinality(o, all) > 1){
                    positionsToRemove.add(count);
                    all.remove(all.indexOf(o));
                }
                count++;
            }
            for(Integer i : positionsToRemove){
                list.remove(i);
            }
        }

        return all;
    }
}
