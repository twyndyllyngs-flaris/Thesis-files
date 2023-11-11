export class TreeList{
    #size = 0;
    #frequency = 5;
    #head;
    #tail;
    
    // inner classes
    #Node = class{
        item
        prev
        next
        prevNode
        nextNode

        constructor(item){
            this.item = item
        }
    }

    // general functions
    print(){
        if(this.isEmpty()){
            console.log("List is Empty")
            return
        }

        let node = this.#head
    
        for(let i = 0; i < this.#size; i++){
            let cell = "[";
            cell += node.prevNode === undefined ? "X|" : node.prevNode.item + "|";
            cell += node.prev === undefined ? "X|" : node.prev.item + "|";
            cell += node.item + "|";
            cell += node.next === undefined ? "X|" : node.next.item + "|";
            cell += node.nextNode === undefined ? "X" : node.nextNode.item + "";
            cell += "]";

            node = node.next;

            console.log(cell)
        }
    }

    size(){
        return this.#size;
    }

    isEmpty(){
        return this.#size === 0;
    }

    #isTimeToAdd(){
        return this.#size % this.#frequency === 0;
    }

    #isLeaf(node){
        return node.prevNode === undefined && node.nextNode === undefined;
    }

    // add functions
    add(item){
        let nodeToBeAdded = new this.#Node(item);

        if(this.#size === 0){
            this.#head = nodeToBeAdded;
            this.#tail = this.#head;
            this.#size += 1;
            return;
        }

        this.#addAfter(this.#tail, nodeToBeAdded);
        nodeToBeAdded.prevNode = this.#tail.prevNode;
        this.#tail.prevNode = undefined;
        this.#tail = nodeToBeAdded;

        //index of current middle pointer
        let currentIndex = Math.floor((this.size - 1) / 2);

        this.#size += 1;

        if(this.#isTimeToAdd()){
            if(this.#tail.prevNode === undefined){
                let temp = this.#tail;

                let gap = Math.floor((this.#size-1) / 2);

                for(let i = 0; i < gap; i++){
                    temp = temp.prev;
                }

                this.#head.nextNode = temp;
                this.#tail.prevNode = temp;
            }else{
                this.#addPointers(this.#tail, this.#tail.prevNode, 0, this.#size-1, currentIndex, this.#size-1, 0, this.#size-2, currentIndex);
            }
        }else if (this.size > this.frequency){
            this.#updatePointers(this.#tail, this.#tail.prevNode, 0, this.#size-1, currentIndex, this.#size-1, 0, this.#size-2, currentIndex);
        }
    }

    #updatePointers(parentPointer, currentPointer, lowIndex, highIndex, currentIndex, parentIndex, originalLow, originalHigh, originalIndex){
        let range = lowIndex + highIndex;

        if(currentIndex !== Math.floor(range / 2)){
            let newPointer = currentPointer.next;
            newPointer.nextNode = currentPointer.nextNode;
            newPointer.prevNode = currentPointer.prevNode;

            currentPointer.nextNode = undefined;
            currentPointer.prevNode = undefined;

            currentPointer = currentPointer.next;
            currentIndex = currentIndex + 1;

            if(currentIndex === Math.floor((this.size - 1) / 2)){
                this.#head.nextNode = newPointer;
                this.#tail.prevNode = newPointer;
            }else if(currentIndex <= parentIndex){
                parentPointer.prevNode = newPointer;
            }else{
                parentPointer.nextNode = newPointer;
            }
        }

        if(currentPointer.prevNode !== undefined){
            let prevNode = currentPointer.prevNode;
            let prevIndex = Math.floor((originalLow + originalIndex) / 2);
            this.#updatePointers(currentPointer, prevNode, lowIndex, currentIndex, prevIndex, highIndex, originalLow, originalIndex, prevIndex);
        }

        if(currentPointer.nextNode !== undefined){
            let nextNode = currentPointer.nextNode;
            let nextIndex = Math.floor((originalIndex + originalHigh) / 2);
            this.#updatePointers(currentPointer, nextNode, currentIndex, highIndex, nextIndex, lowIndex, originalIndex, originalHigh, nextIndex);
        }
    }

    #addAfter(node, nodeToBeAdded){
        let next = node.next;

        node.next = nodeToBeAdded;

        nodeToBeAdded.prev = node;
        nodeToBeAdded.next = next;

        if(node !== this.#tail){
            next.prev = nodeToBeAdded;
        }
    }

    #addPointers(parentPointer, currentPointer, lowIndex, highIndex, currentIndex, parentIndex, originalLow, originalHigh, originalIndex){
        let range = lowIndex + highIndex;

        if(currentIndex !== Math.floor(range / 2)){
            let newPointer = currentPointer.next;
            newPointer.nextNode = currentPointer.nextNode;
            newPointer.prevNode = currentPointer.prevNode;

            currentPointer.nextNode = undefined;
            currentPointer.prevNode = undefined;

            currentPointer = currentPointer.next;
            currentIndex = currentIndex + 1;

            if(currentIndex === Math.floor((this.size - 1) / 2)) {
                this.#head.nextNode = newPointer;
                this.#tail.prevNode = newPointer;
            }else if(currentIndex <= parentIndex){
                parentPointer.prevNode = newPointer;
            }else{
                parentPointer.nextNode = newPointer;
            }
        }

        // recursions
        if(currentPointer.prevNode !== undefined){
            let prevNode = currentPointer.prevNode;
            let prevIndex = Math.floor((originalLow + originalIndex) / 2);
            this.#addPointers(currentPointer, prevNode, lowIndex, currentIndex, prevIndex, highIndex, originalLow, originalIndex, prevIndex);
        }

        if(currentPointer.nextNode !== undefined){
            let nextNode = currentPointer.nextNode;
            let nextIndex = Math.floor((originalIndex + originalHigh) / 2);
            this.#addPointers(currentPointer, nextNode, currentIndex, highIndex, nextIndex, lowIndex, originalIndex, originalHigh, nextIndex);
        }

        if(this.#isLeaf(currentPointer)){
            this.#addPointerFrom(currentPointer, lowIndex, currentIndex, true);
            this.#addPointerFrom(currentPointer, currentIndex, highIndex, false);
        }
    }

    #addPointerFrom(parent, lowIndex, highIndex, isLeft){
        let node = parent;

        if(isLeft){
            let gap = Math.ceil((highIndex - lowIndex) / 2);

            for(let i = 0; i < gap; i++){
                node = node.prev;
            }

            parent.prevNode = node;
        }else{
            let gap = Math.floor((lowIndex + highIndex) / 2) - lowIndex;

            for(let i = 0; i < gap; i++){
                node = node.next;
            }

            parent.nextNode = node;
        }
    }
}