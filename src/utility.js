import { UNDEFINED } from "./constants.js";

var counter = 0;
export function uniqueId(base){
  return [
    (base || ""),
    (counter++).toString(32),
    Date.now().toString(32),
    Math.random().toString(32).substring(2),
  ].join("_");
}

export function easyMin(array, item, compare){
  const c = compare(item, getFirst(array));
  if(c < 0) return Number.NEGATIVE_INFINITY;
  if(c === 0) return 0;
  return false;
}

export function easyMax(array, item, compare){
  const c = compare(item, getLast(array));
  if(c > 0) return Number.POSITIVE_INFINITY;
  if(c === 0) return array.length - 1;
  return false;
}

export function easySingle(array, item, compare){
  const c = compare(item, getFirst(array));
  if(c > 0) return Number.POSITIVE_INFINITY;
  if(c < 0) return Number.NEGATIVE_INFINITY;
  return 0;
}

export function getFirst(array){
  return array[0];
}

export function getLast(array){
  return array[array.length - 1];
}

export function minIndexOrDefault(minIndex, testedNext){
  if(minIndex === UNDEFINED){
    return 1 + (testedNext ? 1 : 0);
  }
  if(minIndex === 0){
    return 1 + (testedNext ? 1 : 0);
  }
  return minIndex;
}

export function maxIndexOrDefault(maxIndex, array, testedPrev){
  if(maxIndex === UNDEFINED){
    return array.length - 2 + (testedPrev ? -1 : 0);
  }
  if(maxIndex === array.length - 1){
    return array.length - 2  + (testedPrev ? -1 : 0);
  }
  return maxIndex;
}

export function isFound(index){
  if(Array.isArray(index)) return true;
  if(index < 0) return false;
  if(index === Number.POSITIVE_INFINITY) return false;
  return true;
}

export function prepareIndexForUse(index){
  if(index === Number.POSITIVE_INFINITY) return index;
  if(index === Number.NEGATIVE_INFINITY) return index;
  if(index < 0) return -1 * index;
  return 1 + index;
}

export class LinkedList {
  get length(){
    return this._length;
  }
  get first(){
    return this.start;
  }
  get last(){
    return this.end;
  }
  constructor(maybeArray){
    if(maybeArray){
      this.fromArray(maybeArray);
    } else {
      this._length = 0;
    }
  }
  push(newItem){
    var node = {
      next: UNDEFINED,
      prev: this.end,
      item: newItem,
    };
    if(this._length === 0){
      this.end = node;
      this.start = node;
    } else {
      this.end.next = node;
      this.end = node;
    }
    this._length++;
  }
  pop(){
    const node = this.end;
    switch(this._length){
      case 0: throw new Error("Cannot pop an empty list");
      case 1: {
        this.start = UNDEFINED;
        this.end = UNDEFINED;
        break;
      }
      default: {
        this.end = node.prev;
        this.end.next = UNDEFINED;
      }
    }
    this._length--;
    return node.item;
  }
  unshift(newItem){
    const node = {
      next: this.start,
      prev: UNDEFINED,
      item: newItem,
    };
    if(this._length === 0){
      this.start = node;
      this.end = node;
    } else {
      this.start.prev = node;
      this.start = node;
    }
    this._length++;
  }
  shift(){
    var node = this.start;
    switch(this._length){
      case 0: throw new Error("Cannot pop an empty list");
      case 1: {
        this.start = UNDEFINED;
        this.end = UNDEFINED;
        break;
      }
      default: {
        this.start = node.next;
        this.start.prev = UNDEFINED;
      }
    }
    this._length--;
    return node.item;
  }
  fromArray(array){
    if(this._length > 0){
      throw new Error("Cannot update a non empty Linked List");
    }
    var len = array.length;
    if(len === 0) return;
    this.start = {
      item: array[0]
    };
    var prevNode = this.start;
    var nextNode;
    for(var i = 1; i < len; i++){
      nextNode = {
        prev: prevNode,
        item: array[i]
      };
      prevNode.next = nextNode;
      prevNode = nextNode;
    }
    this.end = prevNode;
    this._length = len;
  }
  toArray(){
    return Array.from(this);
  }
  clear(){
    this.start = UNDEFINED;
    this.end = UNDEFINED;
    this._length = 0;
  }
  iterator(){
    var currentItem = this.start;
    return {
      next(){
        if(currentItem === UNDEFINED){
          return { done: true };
        }
        const prevItem = currentItem;
        currentItem = prevItem.next;
        return {
          done: false,
          value: prevItem.item,
        };
      },
    };
  }
  concat(otherItem){
    if(Array.isArray(otherItem)){
      otherItem = new LinkedList(otherItem);
    }
  }
}

export function linkedListFactory(){
  var length = 0;
  var start = UNDEFINED;
  var end = UNDEFINED;

  return {
    get length(){
      return length;
    },
    push(newItem){
      var node = {
        next: UNDEFINED,
        prev: end,
        item: newItem,
      };
      if(length === 0){
        end = node;
        start = node;
      } else {
        end.next = node;
        end = node;
      }
      length++;
    },
    pop(){
      const node = end;
      switch(length){
        case 0: throw new Error("Cannot pop an empty list");
        case 1: {
          start = UNDEFINED;
          end = UNDEFINED;
          break;
        }
        default: {
          end = node.prev;
          end.next = UNDEFINED;
        }
      }
      length--;
      return node.item;
    },
    unshift(newItem){
      const node = {
        next: this.start,
        prev: UNDEFINED,
        item: newItem,
      };
      if(length === 0){
        start = node;
        end = node;
      } else {
        start.prev = node;
        start = node;
      }
      length++;
    },
    shift(){
      var node = start;
      switch(length){
        case 0: throw new Error("Cannot pop an empty list");
        case 1: {
          start = UNDEFINED;
          end = UNDEFINED;
          break;
        }
        default: {
          start = node.next;
          start.prev = UNDEFINED;
        }
      }
      length--;
      return node.item;
    },
    fromArray(array){
      if(length > 0){
        throw new Error("Cannot update a non empty Linked List");
      }
      start = {
        item: array[0]
      };
      var prevNode = start;
      var nextNode;
      for(var i = 1; i < length; i++){
        nextNode = {
          prev: prevNode,
          item: array[i]
        };
        prevNode.next = nextNode;
        prevNode = nextNode;
      }
      end = prevNode;
    },
    toArray(maxLength = Number.POSITIVE_INFINITY){
      if(length === 0) return [];
      const array = [];
      var currentNode = start;
      var i = 0;
      do{
        array.push(currentNode.item);
        if(currentNode.next === UNDEFINED){
          return array;
        }
        currentNode = currentNode.next;
      }while(maxLength > i++);
    },
    clear(){
      start = UNDEFINED;
      end = UNDEFINED;
      length = 0;
    },
    iterator(){
      var currentItem = this.start;
      return {
        next(){
          if(currentItem === UNDEFINED){
            return { done: true };
          }
          const prevItem = currentItem;
          currentItem = prevItem.next;
          return {
            done: false,
            value: prevItem.item,
          };
        },
      };
    },
  };
}
