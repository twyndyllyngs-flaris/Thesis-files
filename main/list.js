export class LinkedList{
    #size = 0
    #head
    #tail 

    #Node = class{
        prev
        next
        item

        constructor(item){
            this.item = item;
        }
    }

    print(){
        if(this.isEmpty()){
            console.log("List is Empty")
            return
        }

        
        let node = this.#head
    
        for(let i = 0; i < this.#size; i++){
            let str = `[`
            str += node.prev === undefined ? `X|` : node.prev.item + `|`
            str += node.item + `|`
            str += node.next === undefined ? `X` : node.next.item
            str += `]`

            node = node.next

            console.log(str)
        }
    }

    size(){
        return this.#size
    }

    add(item){
        let nodeToBeAdded = new this.#Node(item)

        if(this.#size === 0){
            this.#head = nodeToBeAdded
            this.#tail = this.#head
            this.#size += 1
            return
        }

        this.#addAfter(this.#tail, nodeToBeAdded)
        this.#tail = nodeToBeAdded
        this.#size += 1;
    }

    get(index){
        return this.#getNode(index).item
    }

    remove(index){
        let nodeToBeDeleted = this.#getNode(index)
        let nextNode = nodeToBeDeleted.next
        let prevNode = nodeToBeDeleted.prev

        if(this.#size === 1){
            this.#head = undefined
            this.#tail = undefined
        }else if(nodeToBeDeleted === this.#head){
            nextNode.prev = undefined
            this.#head = nextNode
        }else if(nodeToBeDeleted === this.#tail){
            prevNode.next = undefined
            this.#tail = prevNode
        }else{
            nextNode.prev = prevNode
            prevNode.next = nextNode
        }

        this.#size -= 1
        return nodeToBeDeleted.item
    }

    pop(){
        return this.remove(this.#size-1)
    }

    isEmpty(){
        return this.#size === 0
    }

    #getNode(index){
        let pointer = this.#getClosest(index)

        if(pointer === this.#tail){
            for(let i = this.#size-1; i > index; i--){
                pointer = pointer.prev
            }
        }else{
            for(let i = 0; i < index; i++){
                pointer = pointer.next
            }
        }

        return pointer
    }

    #getClosest(index){
        if(this.isEmpty()){
            throw new Error('List is Empty')
        }

        if(index < 0 || index >= this.#size){
            throw new Error('Index is out of bounds')
        }

        let tailIndex = this.#size -1
        let headIndex = 0

        if((index - headIndex) < (tailIndex - index)){
            return this.#tail
        }else{
            return this.#head
        }
    }

    #addAfter(node, nodeToBeAdded){
        let next = node.next
        
        node.next = nodeToBeAdded

        nodeToBeAdded.prev = node;
        nodeToBeAdded.next = next;

        if(node !== this.#tail){
            next.prev = nodeToBeAdded;
        }
    }
}
