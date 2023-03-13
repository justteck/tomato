import './scss/index.scss';
import './index.html';

import {Task} from './js/task';
import {Tomato} from './js/tomato';

let count = 0;
const imp = ['default', 'important', 'so-so']
document.querySelector('.button-importance').addEventListener('click', ({target}) => {
  count += 1;
  if (count >= imp.length) {
    count = 0
  }

  for (let i = 0; i < imp.length; i++) {
    if (count === i) {
      target.classList.add(imp[i])
    } else {
      target.classList.remove(imp[i])
    }
  }
})

// --test--
const timer = new Tomato();

timer.addTask(new Task('wake up')).addTask(new Task('eat')).addTask(new Task('sleep')).showTasks();

timer.activateTask(timer.showTasks()[0].getId());
timer.runTimerTask();
