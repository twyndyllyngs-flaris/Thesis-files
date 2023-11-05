import { LinkedList } from "./list.js";
import { MyList } from "./MyList.js";

let mylist = new MyList()

mylist.add(1)
mylist.add(2)
mylist.add(3)
mylist.add(4)
mylist.add(5)
mylist.add(6)
mylist.add(7)
mylist.add(8)
mylist.add(9)
mylist.add(10)

//mylist.print()

for(let i = 0; i < mylist.size(); i++){
    console.log(mylist.get(i))
}
