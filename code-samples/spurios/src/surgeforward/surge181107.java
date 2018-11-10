/*Consider the following structure

class Person {
   String name;
   Person father;
   Person mother;

   Person(string name, Person father, Person mother) {
       this.name = name;
       this.father = father;
       this.mother = mother;
   }
}

Think of an Ancestory.com-style system where people just enter whatever ancestors they can think of.
Assume that everything is loaded into memory and that performance is not an issue.
When the system runs out of data it will have person.mother == null or person.father == null

We want this to be thread-safe so no static state.

//Get names of this person and all their ancestors in the system.
static List<string> getNamesOfAllAncestors(Person p) {
  	List<String> result = new ArrayList<>()
    List<Person> persons = new ArrayList()

   	// traverese p
    while (p != null) {
      result.add(p.name);
      if (p.father != null) persons.add(father);
      if (p.mother != null) persons.add(mother);
      if (persons.size() == 0) break
      p = persons.remove(0)
    }
  	return result;
}



So as an example

var pebbles = new Person("Pebbles",
 new Person("Fred",
            new Person("Ed", null, null),
            new Person("Edna", null, null)
 ),
 new Person("Wilma",
            null,
            new Person("Pearl", null, null)
 )
)

getNamesOfAllAncestors(pebbles)

Will return in no particular order

Pebbles, Fred, Ed, Edna, Wilma, Pearl

// https://livecoding.surgeforward.com/session/-LQk7TmDkJ8eAu5_MLLq
*/
