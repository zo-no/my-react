class EventPool {
  constructor() {
    this.pool = [];
  }

  getEvent() {
    if (this.pool.length > 0) {
      // 如果池中有事件对象，取出并返回
      return this.pool.pop();
    } else {
      // 如果池中没有事件对象，创建一个新的并返回
      return {};
    }
  }

  releaseEvent(event) {
    // 重置事件对象
    for (let prop in event) {
      if (event.hasOwnProperty(prop)) {
        delete event[prop];
      }
    }
    // 将事件对象放回池中
    this.pool.push(event);
  }
}

// 创建一个新的事件池
let eventPool = new EventPool();

// 获取一个事件对象
let event = eventPool.getEvent();

// 使用事件对象
event.type = "click";
event.target = "button";

console.log(event); // 输出：{ type: 'click', target: 'button' }

// 释放事件对象
eventPool.releaseEvent(event);

// 再次获取事件对象
let event2 = eventPool.getEvent();

console.log(event2); // 输出：{}
