class LinkedNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }

    toString() {
        return this.data.toString();
    }
}

export class LinkedList {
    constructor() {
        this.clear();
    }

    addAll(list) {
        if (list instanceof LinkedList) {
            const it = list.iterator();
            while (it.hasNext())
                this.add(it.next());
        } else {
            for (let e of list)
                this.add(e);
        }
    }

    add(data) {this.push(data);}
    push(data) {
        const node = new LinkedNode(data);

        if (this.head == null) {
            this.head = node;
        } else {
            const n = this.tail;
            this.connect(n, node);
        }
        this.tail = node;
        this.length++;
    }

    get(index) {
        if (index < 0 || index >= length) throw Error("Index " + index + " I out of bounds for size [" + length + "]")
        let cn = this.head;
        let i = 0;
        for (; cn != null && i < index; i++) cn = cn.getNext();
        return i == index ? cn.data : null;
    }

    remove(index) {
        if (index < 0 || index >= length) throw Error("Index " + index + " I out of bounds for size [" + length + "]")
        const node = this.get(index);
        if (node == null) return null;
        return this.removeNode(node);
    }

    removeNode(node) {
        if (node == null) throw Error("Cannot remove null node");
        const prev = node.prev;
        const next = node.next;
        if (prev != null && next != null) {
            this.connect(prev, next);
        }
        if (prev == null) {
            this.head = next;
            if (next != null) next.prev = null;
        }
        if (next == null) {
            this.tail = prev;
            if (prev != null) prev.next = null;
        }
        this.length--;
        return node.data;
    }

    peek() {
        return this.tail.data;
    }

    pop() {
        if (this.length <= 0) throw Error("Cannot pop empty list");
        return this.removeNode(this.tail);
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    connect(n1, n2) {
        n1.next = n2;
        n2.prev = n1;
    }

    size() {
        return this.length;
    }

    iterator() {
        return new LinkedListIterator(this);
    }

    toString() {
        let n = this.head;
        let str = "h: " + this.head + " t: " + this.tail + " [";
        while (n != null) {
            str += n.data.toString() + (n.next != null ? ", " : "");
            n = n.next;
        }
        str += "]";
        return str;
    }
}

export class LinkedListIterator {
    constructor(list) {
        if (list == null) throw new Error("Cannot pass null list");
        this.list = list;
        this.node = null;
        this.prevNode = list.tail;
        this.nextNode = list.head;
        // setting the prev and next node
        // like this allows the user to traverse the list
        // forwards or backwards if they want to, while
        // being terminating either way
    }

    setNode(node) {
        this.node = node;
        this.prevNode = node.prev;
        this.nextNode = node.next;
    }

    hasNext() {
        return this.nextNode !== null;
    }

    hasPrev() {
        return this.prevNode !== null;
    }

    next() {
        if (this.nextNode == null) throw new Error("next() call with no further elements");
        this.setNode(this.nextNode);
        return this.node.data;
    }

    prev() {
        if (this.prevNode == null) throw new Error("prev() call with no further elements");
        this.setNode(this.prevNode);
        return this.node.data;
    }

    remove() {
        if (this.node == null) throw new Error("Cannot remove null element");
        const n = this.node;
        this.node = null;
        return this.list.removeNode(n);
    }

    toString() {
        return this.prevNode + " <- " + this.node + " -> " + this.nextNode;
    }
}
