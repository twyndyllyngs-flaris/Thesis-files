export class MyList{
    #size = 0
    #frequency = 5
    #head
    #tail

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

    size(){
        return this.#size
    }

    print(){
        let node = this.#head;

        for(let i = 0; i < this.#size; i++){
            let cell = "[";
            cell += node.prevNode === undefined ? "X|" : node.prevNode.item + "|";
            cell += node.prev === undefined ? "x|" : node.prev.item + "|";
            cell += node.item + "|";
            cell += node.next === undefined ? "x|" : node.next.item + "|";
            cell += node.nextNode === undefined ? "X" : node.nextNode.item + "";
            cell += "]";

            node = node.next;

            console.log(cell)
        }
    }

    add(item){
        let nodeToBeAdded = new this.#Node(item)

        if(this.isEmpty()){
            this.#head = nodeToBeAdded
            this.#tail = this.#head
            this.#size += 1
            return
        }

        this.#addAfter(this.#tail, nodeToBeAdded)
        nodeToBeAdded.prevNode = this.#tail.prevNode
        this.#tail.prevNode = undefined
        this.#tail = nodeToBeAdded

        // index of currentMiddlePointer
        let currentIndex = Math.floor((this.#size -1 ) / 2)

        this.#size += 1;

        if(this.#isTimeToAdd()){
            if(this.#tail.prevNode === undefined){
                let temp = this.#tail

                let gap = Math.floor((this.#size -1) / 2)

                for(let i = 0; i < gap; i++){
                    temp = temp.prev
                }

                this.#head.nextNode = temp
                this.#tail.prevNode = temp
            }else{
                this.#addPointers(this.#tail, this.#tail.prevNode, 0, this.#size-1, currentIndex, this.#size-1, 0, this.#size-2, currentIndex)
            }
        }else if(this.#size > this.#frequency){
            this.#updatePointers(this.#tail, this.#tail.prevNode, 0, this.#size-1, currentIndex, this.#size-1, 0, this.#size-2, currentIndex)
        }
    }

    get(index){
        return this.#getNode(index).item
    }

    isEmpty(){
        return this.#size === 0
    }

    #getNode(index){
        let returnObject = this.#getClosest(index)

        let pointer = returnObject[0];
        let closestIndex = returnObject[1];
        let isLowerClosest = returnObject[2];

        if(isLowerClosest){
            for(let i = closestIndex; i < index; i++){
                pointer = pointer.next;
            }
        }else{
            for(let i = closestIndex; i > index; i--){
                pointer = pointer.prev;
            }
        }

        return pointer;
    }

    #getClosest(index){
        if(this.isEmpty()){
            throw new Error('List is Empty')
        }

        if(index < 0 || index >= this.#size){
            throw new Error('Index is out of bounds')
        }

        let lowerPointer = this.#head;
        let higherPointer = this.#tail;
        let lowerIndex = 0;
        let higherIndex = this.#size-1;

        while(this.#isInRange(index, lowerIndex, higherIndex) && lowerPointer.next !== undefined){
            let sumRange = lowerIndex + higherIndex;

            if((index - lowerIndex) < (higherIndex - index)){
                // head is closer
                higherPointer = higherPointer.prevNode;
                higherIndex = higherIndex - (sumRange - index);

                if(index === lowerIndex) {
                    return [lowerPointer, lowerIndex, true]
                    
                }
            }else{
                lowerPointer = lowerPointer.nextNode;
                lowerIndex = lowerIndex + (sumRange - index);

                if(index === higherIndex){
                    return [higherPointer, higherIndex, false];
                }
            }
        }

        if(this.#lowerPointerIsCloser(index, lowerIndex, higherIndex)){
            return [lowerPointer, lowerIndex, true];
        } else{
            return [higherPointer, higherIndex, false];
        }
    }

    #lowerPointerIsCloser(index, lowerIndex, higherIndex){
        return (index - lowerIndex) < (higherIndex - index);
    }

    #isInRange(index, lower, higher){
        return index >= lower && index <= higher;
    }

    #updatePointers(parentPointer, currentPointer, lowIndex, highIndex, currentIndex, parentIndex, orignalLow, originalHigh, originalIndex){
        let range = lowIndex + highIndex

        //moving pointer to the right accordingly
        if(currentIndex !== Math.floor(range / 2)){
            let newPointer = currentPointer.next
            newPointer.nextNode = currentPointer.nextNode
            newPointer.prevNode = currentPointer.prevNode

            currentPointer.nextNode = undefined
            currentPointer.prevNode = undefined
            currentPointer = currentPointer.next
            currentIndex += 1

            if(currentIndex === Math.floor((this.#size -1) / 2)){
                this.#head.nextNode = newPointer;
                this.#tail.prevNode = newPointer;
            }else if(currentIndex <= parentIndex){
                parentPointer.prevNode = newPointer
            }else{
                parentPointer.nextNode = newPointer
            }
        }

        // recursions
        if(currentPointer.prevNode !== undefined){
            let prevNode = currentPointer.prevNode
            let prevIndex = Math.floor((orignalLow + originalIndex) / 2)
            this.#updatePointers(currentPointer, prevNode, lowIndex, currentIndex, prevIndex, highIndex, orignalLow, originalIndex, originalHigh)
        }

        if(currentPointer.nextNode !== undefined){
            let nextNode = currentPointer.nextNode;
            let nextIndex = Math.floor((originalIndex + originalHigh) / 2);
            this.#updatePointers(currentPointer, nextNode, currentIndex, highIndex, nextIndex, lowIndex, originalIndex, originalHigh, nextIndex);
        }
    }

    #addPointers(parentPointer, currentPointer, lowIndex, highIndex, currentIndex, parentIndex, orignalLow, originalHigh, originalIndex){
        let range = lowIndex + highIndex

        //moving pointer to the right accordingly
        if(currentIndex !== Math.floor(range / 2)){
            let newPointer = currentPointer.next
            newPointer.nextNode = currentPointer.nextNode
            newPointer.prevNode = currentPointer.prevNode

            currentPointer.nextNode = undefined
            currentPointer.prevNode = undefined
            currentPointer = currentPointer.next
            currentIndex += 1

            if(currentIndex === Math.floor((this.#size -1) / 2)){
                this.#head.nextNode = newPointer;
                this.#tail.prevNode = newPointer;
            }else if(currentIndex <= parentIndex){
                parentPointer.prevNode = newPointer
            }else{
                parentPointer.nextNode = newPointer
            }
        }

        // recursions
        if(currentPointer.prevNode !== undefined){
            let prevNode = currentPointer.prevNode
            let prevIndex = Math.floor((orignalLow + originalIndex) / 2)
            this.#addPointers(currentPointer, prevNode, lowIndex, currentIndex, prevIndex, highIndex, orignalLow, originalIndex, originalHigh)
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
        let node = parent

        if(isLeft){
            let gap = Math.ceil((highIndex - lowIndex) / 2)

            for(let i = 0; i < gap; i++){
                node = node.prev
            }

            parent.prevNode = node
        }else{
            let gap = Math.floor(((lowIndex + highIndex) / 2)) - lowIndex;

            for(let i = 0; i < gap; i++){
                node = node.next;
            }

            parent.nextNode = node;
        }
    }

    #isLeaf(node){
        return node.prevNode === undefined && node.nextNode === undefined
    }

    #isTimeToAdd(){
        return this.#size % this.#frequency === 0
    }

    #addAfter(node, nodeToBeAdded){
        let next = node.next

        node.next = nodeToBeAdded

        nodeToBeAdded.prev = node
        nodeToBeAdded.next = next

        if(node !== this.#tail){
            next.prev = nodeToBeAdded
        }
    }
}