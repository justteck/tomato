import {el, mount} from 'redom';
import {Tomato} from './model';
import {ControllerTomato} from './controller';

class RenderTomato {
  constructor(elements, timerParameters = {}) {
    this.model = new Tomato(this, timerParameters);
    this.controller = new ControllerTomato(this.model, elements);

    this.elements = elements;
    this.init();
  }

  // popup div
  popup = this.createTaskPopup();

  // default init
  init() {
    this.initHidePopup();
    this.renderActiveTitle();
    this.renderActiveCount();
    this.renderTimer(this.controller.handleGetDefaultTime() / 1000);
    this.addTask();
    this.hidePopup();
    this.listenTimerBtns();
    this.listenDeleteBtn();
    this.listenEditBtn();
    this.listenActivateTask();
    this.renderPopup();
    this.renderTotalTime()
  }

  // ------
  // create task popup
  createTaskPopup() {
    const popup = el('div.burger-popup burger-popup_active', [
      el('button.popup-button burger-popup__edit-button', 'Редактировать'),
      el('button.popup-button burger-popup__delete-button', 'Удалить')
    ]);

    return popup;
  }

  // hide default popup
  initHidePopup() {
    this.elements.taskPopUp?.remove();
  }

  // render popup listener callback
  renderPopupCallback = ({target}) => {
    // if clicked task menu btn
    if (target.matches('.pomodoro-tasks__task-button')) {
      const popup = target.nextElementSibling; // popup element

      if (popup) { // if exists
        popup.remove();
      } else {
        target.insertAdjacentElement('afterend', this.popup);
      }
    }
  }

  // render popup
  renderPopup() {
    this.elements.tasksList.removeEventListener('click', this.renderPopupCallback);
    this.elements.tasksList.addEventListener('click', this.renderPopupCallback);
  }

  // hide popup
  hidePopup () {
    document.addEventListener('click', ({target}) => {
      const popup = document.querySelector('.burger-popup_active');

      if (popup) { // if exists
        if (!popup.contains(target) && !target.matches('.pomodoro-tasks__task-button')) {
          popup.remove();
        }
      }
    });
  }

  // render alert popup
  renderAlertPopup(element) {
    const alertMessage = el('span', 'Сначала остановите таймер!');
    // insert message 
    element.insertAdjacentElement('afterend', alertMessage);
    // remove message after 3s
    setTimeout(() => {
      alertMessage.remove();
    }, 3000);
  }

  //-----------

  // check active task
  isActiveTask() {
    return this.model.getActiveTask() ? true : false;
  }

  // render tomato count
  renderActiveCount() {
    if (this.isActiveTask()) {
      this.elements.activeTaskCount.textContent = `Томат ${this.controller.handleGetActiveTaskCount()}`;
    } else {
      this.elements.activeTaskCount.textContent = `Томат 0`;
    }
  }

  // render active task title
  renderActiveTitle() {
    if (this.isActiveTask()) {
      this.elements.activeTaskTitle.textContent = this.controller.handleGetActiveTaskTitle();
    } else {
      this.elements.activeTaskTitle.textContent = 'Нет активной задачи';
    }
  }

  // render last task
  renderLastAddedTask() {
    const lastTask = this.controller.handleGetLastTask();

    const title = lastTask.getTitle();
    const importance = lastTask.getImportance();
    const id = lastTask.getId();

    const element = this.creteTaskItem(title, importance, id);

    this.elements.tasksList.append(element); // add on page

    this.listenBlurTask();
  }

  //-------
  // create task list item
  creteTaskItem(title, importance, id) {
    const taskCount = el('span.count-number', 1);
    const taskTitle = el('button.pomodoro-tasks__task-text', el('span.task-title-btn', title));
    const taskMenuBtn = el('button.pomodoro-tasks__task-button');

    const li = el(`li.pomodoro-tasks__list-task ${importance}`, [taskCount, taskTitle, taskMenuBtn]);
    li.dataset.id = id;

    return li;
  }

  // add new task
  addTask() {
    // listen for a form submit
    this.elements.taskForm.addEventListener('submit', e => {
      e.preventDefault();

      const taskTitle = this.elements.taskFormInput.value ? this.elements.taskFormInput.value : null; // current task title in input

      if (taskTitle) { // if not empty
        this.controller.handleAddTask(taskTitle);
      } else {
        // change placeholder color
        this.elements.taskFormInput.style.setProperty(`--placeholder`, `red`);

        // change color back
        setTimeout(() => {
          this.elements.taskFormInput.style.setProperty(`--placeholder`, ``);
        }, 2000);
      }
      
      });
  }


  // --------------
  // listen to activate task
  listenActivateTask() {
    document.addEventListener('click', this.activateTask);
  }

  // do not listen activate task
  removeListenActivateTask() {
    document.removeEventListener('click', this.activateTask);
  }
  // activate task
  activateTask = ({target}) => {
    // if task title clicked
    if (target.matches('.pomodoro-tasks__task-text .task-title-btn')) {
      if (this.model.timerId) { // if timer is ON
        // block activating other task
        this.renderAlertPopup(target.parentElement);
        return;
      }

      // all task titles
      const tasks = document.querySelectorAll('.pomodoro-tasks__list-task .task-title-btn');

      tasks.forEach(task => {
        if (target === task) {
          // add active style
          task.closest('button').classList.add('pomodoro-tasks__task-text_active');

          const taskId = task.closest('li').dataset.id;

          this.model.activateTask(taskId);
          this.renderActiveTitle();
          this.renderActiveCount();
        } else { // remove active style
          task.closest('button').classList.remove('pomodoro-tasks__task-text_active');
        }
      });
    }
  }

  // listen for start/stop timer
  listenTimerBtns() {
    this.elements.startBtn.addEventListener('click', () => {
      this.controller.handleRunTimerTask();
    });

    this.elements.stopBtn.addEventListener('click', () => {
      this.controller.handleStopTimer();
    });
  }

  // listen delete task
  listenDeleteBtn() {
      this.elements.tasksList.addEventListener('click',
      ({target}) => {
        if (this.controller.handleDeleteTask(target)) {
          target.closest('.pomodoro-tasks__list-task').remove();
          this.listenBlurTask();
        }
      });
  }

  // listen edit task
  listenEditBtn() {
    // add listener
    this.elements.tasksList.addEventListener('click',
      ({target}) => {
        if (this.controller.handleEditTask(target)) { // edited successfully
          const taskTitle = target
            .closest('.pomodoro-tasks__list-task')
            .querySelector('.pomodoro-tasks__task-text span');

          target.closest('.burger-popup').remove(); // remove popup
          this.removeListenActivateTask(); // do not listen activating task by click

          taskTitle.focus();
          taskTitle.closest('button').classList.add('task-edit'); // add style
        }      
      });
  }

  // listen blur task
  listenBlurTask() {
    const taskTitles = document.querySelectorAll('.pomodoro-tasks__task-text span');

    taskTitles.forEach(titleElement => {
      titleElement.addEventListener('blur', () => {
        const taskId = titleElement.closest('.pomodoro-tasks__list-task').dataset.id;
        const newTitle = titleElement.textContent;

        this.controller.handleSaveAfterBlurTask(titleElement, newTitle, taskId); // save changes

        titleElement.closest('button').classList.remove('task-edit'); // remove style

        this.listenActivateTask(); // listen activating task by click
      });
    });
  }

  // render timer
  renderTimer(time) {
    const min = Math.floor(time / 60);
    const sec = time % 60;

    if (isNaN(time)) {
      this.elements.minutes.textContent = time;
      this.elements.seconds.textContent = time;
    } else {
      this.elements.minutes.textContent = `${min > 9 ? min : `0${min}`}`;

      this.elements.seconds.textContent = `${sec > 9 ? sec : `0${sec}`}`;
    }
  }

  // render total time
  renderTotalTime() {
    if (this.isActiveTask()) {
      const currentTime = this.model.getTotalTime();

      const hours = Math.floor(currentTime / (1000 * 60 * 60));
      const minutes = Math.floor((currentTime - (hours * 1000 * 60 * 60)) / (1000 * 60));

      this.elements.totalTime.textContent = `${hours} часов ${minutes} минут`;
    } else {
      this.elements.totalTime.textContent = `0 часов 0 минут`;
    }
  }
}

export {
  RenderTomato
};
