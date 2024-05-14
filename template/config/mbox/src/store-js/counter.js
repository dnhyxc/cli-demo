import { makeAutoObservable, runInAction } from "mobx";

class AddMobx {
  constructor() {
    makeAutoObservable(this);
  }

  count = 0;

  timer = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }

  // runInAction，处理一部逻辑
  incrementAsync() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setTimeout(() => {
      runInAction(() => {
        this.count++;
      });
    }, 1000);
  }
}

export default new AddMobx();
