package com.attiresoft.javareference;

import java.util.*;
import java.util.Map.Entry;

public class MapInterface {
    /*
    Interface Map<K,V>
    Subinterfaces: NavigableMap<K,V>, ObservableMap<K,V>, ObservableMapValue<K,V> SortedMap<K,V>
    Implementing Classes: ConcurrentHashMap HashMap

    NavigableMap
    Implementing Classes: ConcurrentSkipListMap, TreeMap

    ConcurrentMap
    Unmodifiable Maps: Map.of Map.ofEntries Map.copyOf
    */
    public static void main(String[] args) {
    new MapSorterTest();
    }

    protected static class Navigable {
        public Navigable() {
            int key = 1;
            String value = "x";

            NavigableMap<Integer, String> map = new TreeMap<>();
                /*
                public Entry<Integer, String> lowerEntry(Integer key) {
                public Integer lowerKey(Integer key) {
                public Entry<Integer, String> floorEntry(Integer key) {
                public Integer floorKey(Integer key) {
                public Entry<Integer, String> ceilingEntry(Integer key) {
                public Integer ceilingKey(Integer key) {
                public Entry<Integer, String> higherEntry(Integer key) {
                public Integer higherKey(Integer key) {
                public Entry<Integer, String> firstEntry() {
                public Entry<Integer, String> lastEntry() {
                public Entry<Integer, String> pollFirstEntry() {
                public Entry<Integer, String> pollLastEntry() {
                public NavigableMap<Integer, String> descendingMap() {
                public NavigableSet<Integer> navigableKeySet() {
                public NavigableSet<Integer> descendingKeySet() {
                public NavigableMap<Integer, String> subMap(Integer fromKey, boolean fromInclusive, Integer toKey, boolean toInclusive) {
                public NavigableMap<Integer, String> headMap(Integer toKey, boolean inclusive) {
                public NavigableMap<Integer, String> tailMap(Integer fromKey, boolean inclusive) {
                public SortedMap<Integer, String> subMap(Integer fromKey, Integer toKey) {
                public SortedMap<Integer, String> headMap(Integer toKey) {
                public SortedMap<Integer, String> tailMap(Integer fromKey) {
                public Comparator<? super Integer> comparator() {
                public Integer firstKey() {
                public Integer lastKey() {
                public Set<Integer> keySet() {
                public Collection<String> values() {
                public Set<Entry<Integer, String>> entrySet() {
                public int size() {
                public boolean isEmpty() {
                public boolean containsKey(Object key) {
                public boolean containsValue(Object value) {
                public String get(Object key) {
                public String put(Integer key, String value) {
                public String remove(Object key) {
                public void putAll(Map<? extends Integer, ? extends String> m) {
                public void clear() {
                */
            map.put(key, value);
            map.containsKey(key);
            map.containsValue(value);
            map.clear();
            map.values();
            map.size();

            map.ceilingEntry(1);
            map.subMap(1, true, 2, true);
        }
    }

    public static class MapSorter <K, V extends Comparable<? super V>> {
        public Map<K, V> sortMapByValue(Map<K, V> map) {

            // create a sorted list of the entries: a class containing key and value
            List<Entry<K, V>> list = new ArrayList<>(map.entrySet());
            list.sort(Entry.comparingByValue());

            // LinkedHashMap is a HashMap where entries are a linked list
            Map<K, V> result = new LinkedHashMap<>();
            // LinkedHashMap cannot be constructed from a list so element must be added one by one
            for (Entry<K, V> entry : list) result.put(entry.getKey(), entry.getValue());

            return result;
        }
    }

    public static class MapSorterTest {
        protected final Map<String, Integer> input = Map.of("one", 1, "three", 3, "two", 2);

        public MapSorterTest() {
            MapSorter mapSorter = new MapSorter<String, Integer>();
            System.out.printf("sortMapByValue: input: %s result: %s\n",
                    input,
                    mapSorter.sortMapByValue(input));
        }
    }
}
