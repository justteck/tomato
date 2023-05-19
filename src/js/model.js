import {RenderTomato} from './view';

class Tomato {
  #timeLeft;
  #pauseShort;
  #pauseLong;
  #tasks;
  #activeTask = null;
  timerId = null;

  constructor(view, {time = 15*1000*60, pauseShort = 3*1000*60, pauseLong = 8*1000*60, tasks = []} = {}) {
    if (Tomato._instance) return Tomato._instance; // singleton

    this.view = view;

    this.#pauseShort = pauseShort;
    this.#pauseLong = pauseLong;
    this.#tasks = tasks;
    this.#timeLeft = time;

    Tomato._instance = this;
  }

  // get default tomato time
  getDefaultTime() {
    return this.#timeLeft;
  }

  // COMMAND
  operation(operation, task = {}) {
    if (operation === 'add') {
      new AddTask(task).execute(this.#tasks);
      this.view.renderLastAddedTask();

    } else if (operation === 'remove') {
      new RemoveTask(task).execute(this.#tasks);
      // call view for render
    }
  }

  // get taks by id
  findTask(taskId) {
    return this.#tasks.find(task => task.getId() === taskId);
  }

  // show tasks (array)
  getTasks() {
    return this.#tasks;
  }

  // get last task in list
  getLastTask() {
    return this.getTasks().slice(-1)[0];
  }

  // make task active
  activateTask(taskId) {
    this.#activeTask = this.findTask(taskId);
    return this;
  }

  // get active task
  getActiveTask() {
    return this.#activeTask;
  }

  // get active title
  getActiveTaskTitle() {
    return this.getActiveTask().getTitle();
  }

  // get task count
  getActiveTaskCount() {
    return this.getActiveTask().getCount();
  }

  // get total time
  getTotalTime() {
    return this.getActiveTask().getTotalTime();
  }

  // reset total time
  resetTotalTime() {
    this.getActiveTask().resetTotalTime();
  }

  // change task title
  changeTitle(taskId, newTitle) {
    this.findTask(taskId).setTitle(newTitle);
  }

  // delete task
  deleteTask(taskId) {
    const tasks = this.getTasks();

    const taskToDeleteIndex =
      tasks.findIndex(task => task.getId() === taskId);
    
    // delete from array
    tasks.splice(taskToDeleteIndex, 1);
  }

  // start task timer
  runTimerTask() {
    try {
      if (this.#activeTask) { // active task exists

        //set timeout callback
        const timerTask = (timeLeft) => {
          timeLeft -= 1000; // -1s every second

          this.view.renderTimer(timeLeft / 1000);

          if (timeLeft <= 0) {
            this.#activeTask.setTotalTime(this.#timeLeft); // increase total tomato time
            this.view.renderTotalTime();

            console.log(this.#activeTask.getTotalTime());
            
            this.increaseCounter(this.#activeTask.getId()); // tomato counter ++
            clearTimeout(this.timerId); // stop task timer
            timeLeft = this.#timeLeft; // reset time left to default

            console.log('pause count', this.#activeTask.getCount());

            if (this.#activeTask.getCount() % 4 === 0 &&
                this.#activeTask.getCount() !== 0) {
              this.view.renderActiveCount();
              this.runTimerBrake(this.#pauseLong); // start short brake
            } else {
              this.view.renderActiveCount();
              this.runTimerBrake(this.#pauseShort); // start long brake
            }
          } else { // if time left > 0
            this.timerId = setTimeout(() => timerTask(timeLeft), 10); // run func again
          }
        }


        // run
        let timeLeft = this.#timeLeft;
        this.view.renderTimer(timeLeft / 1000);

        this.timerId = setTimeout(() => timerTask(timeLeft), 10); // run timer
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
    this.timerId = null; // set default value
    this.resetTotalTime(); // total time === 0
    this.view.renderTimer('--');
    this.view.renderTotalTime();
  }

  // start break timer
  runTimerBrake(time) {
    // set timeout callback
    const timerBrake = () => {
      timeLeft -= 1000;
      this.view.renderTimer(timeLeft / 1000);

      if (timeLeft <= 0) {
        clearTimeout(this.timerId);
        this.runTimerTask(this.#timeLeft);
      } else {
        this.timerId = setTimeout(() => timerBrake(), 10);
      }
    }

    let timeLeft = time;
    this.view.renderTimer(timeLeft / 1000);
    this.timerId = setTimeout(() => timerBrake(), 500)
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


//-------
// TASK
class Task {
  #title;
  #count;
  #id;
  #totalTime;
  constructor(title, count = 0) {
    this.#title = title;
    this.#count = count;
    this.#id = this.setId();
    this.#totalTime = 0;
  }

  // id
  setId() {
    return this.#id =
      Date.now().toString(36) + Math.random().toString(36);
  }

  getId() {
    return this.#id;
  }

  // title
  setTitle(title) {
    if (title && String(title).length > 0) {
      this.#title = String(title);
    } else {
      console.log('Имя задачи не может быть пустым');
    }

    return this;
  }

  getTitle() {
    return this.#title;
  }

  // count
  increaseCount() {
    this.#count += 1;
    return this;
  }

  getCount() {
    return this.#count;
  }

  // importance
  getImportance() {
    return this.importance;
  }

  // reset total time
  resetTotalTime() {
    this.#totalTime = 0;
  }

  // time
  setTotalTime(time) {
    this.#totalTime += time;
  }

  getTotalTime() {
    return this.#totalTime;
  }
}

class LowTask extends Task {
  constructor(title, count = 0) {
    super(title, count = 0);
    this.importance = 'default';
  }
}

class StandardTask extends Task {
  constructor(title, count = 0) {
    super(title, count);
    this.importance = 'so-so';
  }
}

class HighTask extends Task {
  constructor(title, count = 0) {
    super(title, count = 0);
    this.importance = 'important';
  }
}

//-------
// command
class TomatoCommand {
  constructor(task) {
    this.task = task;
  }

  execute() {
    throw new Error('Not imlemented');
  }
}

class AddTask extends TomatoCommand {
  execute(tasksArray) {
    tasksArray.push(this.task);
  }
}

class RemoveTask extends TomatoCommand {
  execute(tasksArray) {
    const delTaskIndex = tasksArray.findIndex(task => task.id === this.task.id);
    tasksArray.splice(delTaskIndex, 1);
  }
}


//------
// EXPORTS
export {
  Tomato,
  LowTask,
  StandardTask,
  HighTask
};
