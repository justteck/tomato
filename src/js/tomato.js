export class Tomato {
  #timeLeft;
  #pauseShort;
  #pauseLong;
  #tasks;
  #activeTask = null;
  timerId = null;

  constructor({time = 25, pauseShort = 5, pauseLong = 15, tasks = []} = {}) {
    this.#pauseShort = pauseShort * 1000;
    this.#pauseLong = pauseLong * 1000;
    this.#tasks = tasks;
    this.#timeLeft = time * 1000;
  }

  // add new task
  addTask(task) {
    this.#tasks.push(task);
    return this;
  }

  // get taks by id
  findTask(taskId) {
    return this.#tasks.find(task => task.getId() === taskId);
  }

  // show tasks array
  showTasks() {
    return this.#tasks;
  }

  // make task active
  activateTask(taskId) {
    this.#activeTask = this.findTask(taskId);
    return this;
  }

  // start task timer
  runTimerTask() {
    try {
      if (this.#activeTask) { // active task exists
        // func for set timeout
        const timerTask = (timeLeft) => {
          timeLeft -= 1000; // -1s every second

          console.log('timeLeft: ', timeLeft / 1000);

          if (timeLeft <= 0) {
            clearTimeout(this.timerId); // stop task timer
            timeLeft = this.#timeLeft; // reset time left to default

            console.log('count', this.#activeTask.getCount());

            if (this.#activeTask.getCount() % 3 === 0 &&
                this.#activeTask.getCount() !== 0) { 
              this.runTimerBrake(this.#pauseLong, timerTask, timeLeft); // start short brake
              this.increaseCounter(this.#activeTask.getId()); // task breaks counter ++
            } else {
              this.runTimerBrake(this.#pauseShort, timerTask, timeLeft); // start long brake
              this.increaseCounter(this.#activeTask.getId()); // task breaks counter ++
            }
          } else { // if time left > 0
            this.timerId = setTimeout(() => timerTask(timeLeft), 500); // run func again
          }
        }


        // run
        let timeLeft = this.#timeLeft;

        console.log('timeLeft: ', timeLeft / 1000);
        this.timerId = setTimeout(() => timerTask(timeLeft), 500); // run timer
      } else { // no active task
        throw new Error('Активная задача отсутствует');
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  // stop timer
  stopTimer() {
    clearTimeout(this.timerId);
  }

  // start break timer
  runTimerBrake(time, func, funcArg) {
    // func for set timeout
    const runTimer = (func, funcArg) => {
      timeLeft -= 1000;
      console.log(`Time break ${time/1000} min`, timeLeft / 1000);

      if (timeLeft <= 0) {
        clearTimeout(this.timerId);
        if(func) func(funcArg);
      } else {
        this.timerId = setTimeout(() => runTimer(func, funcArg), 500);
      }
    }

    let timeLeft = time;
    this.timerId = setTimeout(() => runTimer(func, funcArg), 500)
  }

  // increase task counter
  increaseCounter(taskId) {
    this.findTask(taskId).increaseCount();
  }

  // set timer id
  set timerId(timerId) {
    this.timerId = timerId;
    return this.timerId;
  }

  // get timer id
  get timerId() {
    return this.timerId;
  }
}
