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

    #isInRange(index, lower, higher){
        return index >= lower && index <= higher;
    }

    #lowerPointerIsCloser(index, lowerIndex, higherIndex){
        return (index - lowerIndex) < (higherIndex - index);
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
        let currentIndex = Math.floor((this.#size - 1) / 2);

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
        }else if (this.#size > this.#frequency){
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

            if(currentIndex === Math.floor((this.#size - 1) / 2)){

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

            if(currentIndex === Math.floor((this.#size - 1) / 2)) {
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

    // get functions
    get(index){
        if(this.isEmpty()){
            throw new Error('List is Empty')
        }

        if(index < 0 || index >= this.#size){
            throw new Error('Index is out of bounds')
        }

        return this.#getNode(index).item;
    }

    #getNode(index){
        let returnObject = this.#getClosest(index);

        let pointer = returnObject.node;
        let closestIndex = returnObject.index;
        let isLowerClosest = returnObject.isLowerClosest;

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
        let lowerPointer = this.#head;
        let higherPointer = this.#tail;
        let nextPointer = lowerPointer.nextNode;
        let lowerIndex = 0;
        let higherIndex = this.#size-1;

        while(this.#isInRange(index, lowerIndex, higherIndex) && nextPointer !== undefined){
            let sumRange = lowerIndex + higherIndex;

            if(this.#lowerPointerIsCloser(index, lowerIndex, higherIndex)){
                higherPointer = nextPointer;
                nextPointer = nextPointer.prevNode;

                higherIndex = Math.floor(sumRange / 2);

                if(index === lowerIndex) {
                    return {node: higherPointer, index: higherIndex, isLowerClosest: false};
                }
            }else{
                lowerPointer = nextPointer;
                nextPointer = nextPointer.nextNode;

                lowerIndex = Math.floor(sumRange / 2);

                if(index === higherIndex){
                    return {node: higherPointer, index: higherIndex, isLowerClosest: false};
                }
            }
        }

        if(this.#lowerPointerIsCloser(index, lowerIndex, higherIndex)){
            return {node: lowerPointer, index: lowerIndex, isLowerClosest: true};
        } else{
            return {node: higherPointer, index: higherIndex, isLowerClosest: false};
        }

    }

    //remove functions
    remove(index){
        if(this.isEmpty()){
            throw new Error('List is Empty')
        }

        if(index < 0 || index >= this.#size){
            throw new Error('Index is out of bounds')
        }

        let details = this.#getNodeDetails(index);
        let nodeToBeDeleted = details.node;
        let next = nodeToBeDeleted.next;
        let prev = nodeToBeDeleted.prev;
        let nextNode = nodeToBeDeleted.nextNode;
        let prevNode = nodeToBeDeleted.prevNode;
        let parent = details.parent;
        let lowIndex = details.originalLower;
        let highIndex = details.originalHigher;
        //let isLowerClosest = details.isLowerClosest;

        if(this.#size === 1){
            this.#head = undefined;
            this.#tail = undefined;
        } else if(nodeToBeDeleted === this.#head){
            next.prev = undefined;
            next.nextNode = this.#head.nextNode;
            this.#head = next;
        }else if(nodeToBeDeleted === this.#tail){
            prev.next = undefined;
            prev.prevNode = this.#tail.prevNode;
            this.#tail = prev;
        }else if(parent.prevNode === nodeToBeDeleted || parent.nextNode === nodeToBeDeleted){
            next.prev = prev;
            prev.next = next;

            let newMiddleIndex = Math.floor((lowIndex + highIndex - 1 ) / 2);

            if(newMiddleIndex !== index){
                // move left
                prev.nextNode = nextNode;
                prev.prevNode = prevNode;

                if(index === (this.#size-1) / 2){
                    // index is the first middle, have to move both head and tail pointer
                    this.#head.nextNode = prev;
                    this.#tail.prevNode = prev;
                }else if(parent.prevNode === nodeToBeDeleted){
                    parent.prevNode = prev;
                }else{
                    parent.nextNode = prev;
                }
            }else{
                // move right
                next.nextNode = nextNode;
                next.prevNode = prevNode;

                if(index === (this.#size-1) / 2){
                    // index is the first middle, have to move both head and tail pointer
                    this.#head.nextNode = next;
                    this.#tail.prevNode = next;
                }else if(parent.prevNode === nodeToBeDeleted){
                    parent.prevNode = next;
                }else{
                    parent.nextNode = next;
                }
            }
        }else{
            next.prev = prev;
            prev.next = next;
        }

        let isTimeToRemove = this.#isTimeToAdd();

        this.#size -= 1;

        if(isTimeToRemove){
            if(this.#size === this.#frequency){
                this.#head.nextNode = undefined;
                this.#tail.prevNode = undefined;
            }else{
                this.#removePointers(this.#head.nextNode);
            }
        }

        return nodeToBeDeleted.item;
    }

    #removePointers(currentPointer){
        // recursions
        if(currentPointer.prevNode !== undefined && currentPointer.prevNode.prevNode !== undefined){
            this.#removePointers(currentPointer.prevNode);
        }else{
            currentPointer.prevNode = undefined;
        }

        if(currentPointer.nextNode !== undefined && currentPointer.nextNode.nextNode !== undefined){
            this.#removePointers(currentPointer.nextNode);
        }else{
            currentPointer.nextNode = undefined;
        }
    }

    #getNodeDetails(index){
        let returnObject = this.#getClosestNodeDetails(index);

        let closestNode = returnObject.node;
        let isLowerClosest = returnObject.isLowerClosest;

        if(isLowerClosest){
            let closestIndex = returnObject.lowerIndex;
            for(let i = closestIndex; i < index; i++){
                closestNode = closestNode.next;
            }
        }else{
            let closestIndex = returnObject.higherIndex;
            for(let i = closestIndex; i > index; i--){
                closestNode = closestNode.prev;
            }
        }

        returnObject.node = closestNode;

        return returnObject;
    }

    #getClosestNodeDetails(index){
        let lowerPointer = this.#head;
        let higherPointer = this.#tail;
        let nextPointer = lowerPointer.nextNode;
        let parent = this.#head;
        let lowerIndex = 0;
        let higherIndex = this.#size-1;
        let originalLower = lowerIndex;
        let originalHigher = higherIndex;

        while(this.#isInRange(index, lowerIndex, higherIndex) && nextPointer !== undefined){
            let sumRange = lowerIndex + higherIndex;

            if(this.#lowerPointerIsCloser(index, lowerIndex, higherIndex)){
                if(index === lowerIndex) {
                    if(parent === this.#head){
                        parent = higherPointer;
                    }
                    return {node: lowerPointer, parent, originalLower, originalHigher, lowerIndex, higherIndex, isLowerClosest: true};
                }

                parent = higherPointer;
                higherPointer = nextPointer;
                nextPointer = nextPointer.prevNode;

                originalHigher = higherIndex;
                originalLower = lowerIndex;
                higherIndex = Math.floor(sumRange / 2);
            }else{
                if(index === higherIndex){
                    if(parent === this.#tail){
                        parent = lowerPointer;
                    }
                    return {node: higherPointer, parent, originalLower, originalHigher, lowerIndex, higherIndex, isLowerClosest: false};
                }

                parent = lowerPointer;
                lowerPointer = nextPointer;
                nextPointer = nextPointer.nextNode;

                originalLower = lowerIndex;
                originalHigher = higherIndex;
                lowerIndex = Math.floor(sumRange / 2);
            }
        }

        if(this.#lowerPointerIsCloser(index, lowerIndex, higherIndex)){
            return {node: lowerPointer, parent, originalLower, originalHigher, lowerIndex, higherIndex, isLowerClosest: true};
        } else{
            return {node: higherPointer, parent, originalLower, originalHigher, lowerIndex, higherIndex, isLowerClosest: false};
        }
    }
}