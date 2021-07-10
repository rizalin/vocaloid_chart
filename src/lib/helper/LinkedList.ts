export class ListNode<T> {
  value: T;
  next: ListNode<T> | null;
  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList<T> {
  head: ListNode<T> | null;
  size: number;
  constructor() {
    this.head = null;
    this.size = 0;
  }

  /**
   * Add node to the end of the list
   */
  push(value: T): boolean {
    const newNode = new ListNode<T>(value);
    if (!this.head) {
      this.head = newNode;
    }

    // if there are already nodes present
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
    this.size++;
    // you can choose to return anything
    // I will return a boolean to indicate success
    return true;
  }

  /**
   * Remove a node from the end of the list
   */
  pop() {
    // already empty list
    if (!this.head) {
      return false;
    }

    // only head present, can be set to null directly
    if (this.size === 1) {
      this.head = null;
      this.size--;
      return true;
    }

    // we will traverse to the end of the list
    // then remove the link between the second last and the last node
    let current = this.head;
    let prevNode = null;

    while (current.next) {
      prevNode = current;
      current = current.next;
    }

    prevNode.next = null;

    // decrease size after removing node
    this.size--;
    return true;
  }

  /**
   * Remove a node from the start of the list
   */
  shift() {
    if (!this.head) {
      return false;
    }

    let prevHead = this.head;
    this.head = prevHead.next;

    prevHead.next = null;
    this.size--;
    return true;
  }

  /**
   * Add node to the starting of list
   */
  unshift(value: T) {
    const newNode = new ListNode<T>(value);
    if (!this.head) {
      this.head = newNode;
    }

    let prevHead = this.head;
    newNode.next = prevHead;
    this.head = newNode;
    this.size++;
    return true;
  }

  removeAtIndex(n: number) {
    if (n > this.size || n < 0) {
      return null;
    }

    if (n === 0) {
      return this.shift();
    }

    if (n === this.size - 1) {
      return this.pop();
    }

    let counter = 0;
    let current = this.head;
    let prev = null;
    while (counter < n) {
      prev = current;
      current = current.next;
      counter++;
    }
    prev.next = current.next;
    current.next = null;
    this.size--;
    return true;
  }

  insertAtIndex(value: T, n: number) {
    // validate index
    if (n > this.size || n < 0) {
      return null;
    }

    // equivalent to push operation
    if (n === this.size) {
      return this.push(value);
    }

    // obtain new node
    const newNode = new ListNode<T>(value);
    let counter = 0;
    let current = this.head;
    let prev = null;

    // traverse list
    while (counter <= n) {
      prev = current;
      current = current.next;
      counter++;
    }

    // link the gap between nodes before deletion
    prev.next = newNode;

    // sever the node
    newNode.next = current;
    this.size++;
    // recalculate total damage
    return true;
  }

  find(value: T) {
    if (!this.head) {
      return null;
    }

    let current = this.head;
    while (current) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }

    return null;
  }

  insertFromArray(arr: T[]) {
    if (arr.length === 1) {
      return this.unshift(arr[0]);
    }

    for (let i = arr.length - 1; i >= 0; i--) {
      const newNode = new ListNode<T>(arr[i]);

      // if there are already nodes present
      let current = this.head;

      if (!this.head) {
        this.head = newNode;
      } else {
        while (current.next) {
          current = current.next;
        }
        current.next = newNode;
      }
      this.size++;
    }

    return true;
  }

  convertToArray() {
    const array: T[] = [];
    let current = this.head;
    let prevNode = null;

    while (current.next) {
      prevNode = current;
      current = current.next;
      array.push(current.value);
    }

    return array;
  }

  map<U>(callbackfn: (value: T, index: number) => U) {
    if (this.size === 0) {
      return false;
    }

    let current = this.head;
    let prevNode = null;
    let index = 0;

    while (current.next) {
      prevNode = current;
      current = current.next;
      callbackfn(current.value, index);
      index++;
    }
  }

  chunk(size: number) {
    let current = this.head;
    let prevNode = null;
    let array: T[] = [];
    const arrayResult: T[][] = [];

    while (current.next) {
      prevNode = current;
      current = current.next;
      if (array.length < size) {
        array = [...array, current.value];
      } else {
        arrayResult.push(array);
        array = [current.value];
      }
    }

    return arrayResult;
  }
}
