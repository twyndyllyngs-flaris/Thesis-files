import { LinkedList } from "./list.js";
import { TreeList } from "./TreeList.js";

let treelist = new TreeList()

treelist.add(1)
treelist.add(2)
treelist.add(3)
treelist.add(4)
treelist.add(5)
treelist.add(6)
treelist.add(7)
treelist.add(8)
treelist.add(9)
treelist.add(10)
treelist.add(11)
treelist.add(12)
treelist.add(13)
treelist.add(14)
treelist.add(15)

//treelist.print()
treelist.remove(14)

console.log(treelist.size())

treelist.print()

