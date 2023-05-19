import { HighTask, LowTask, StandardTask, Tomato } from './model';
import {elements} from './view/elements';

class ControllerTomato {
  constructor(model, elements) {
    this.model = model;
    this.elements = elements;
  }

  // get active task title
  handleGetActiveTaskTitle () {
    return this.model.getActiveTaskTitle();
  }

  // get active task count
  handleGetActiveTaskCount() {
    return this.model.getActiveTaskCount();
  }

  // get last task
  handleGetLastTask() {
    return this.model.getLastTask();
  }

  // add
  handleAddTask (taskTitle) {
    const add = (importance, taskTitle) => {
      this.model.operation('add', new importance(taskTitle)); // add task
        this.elements.taskFormInput.value = '';
    }

    // check importance
    if (this.elements.addBtnImportance.classList.contains('default')) {
      add(LowTask, taskTitle);
    }

    if (this.elements.addBtnImportance.classList.contains('so-so')) {
      add(StandardTask, taskTitle);
    }

    if (this.elements.addBtnImportance.classList.contains('important')) {
      add(HighTask, taskTitle);
    }
  }

  // activate task
  handleActivateTask(taskId) {
    this.model.activateTask(taskId);
  }

  // run timer
  handleRunTimerTask() {
    this.model.runTimerTask();
  }

  // stop timer
  handleStopTimer() {
    this.model.stopTimer();
  }

  // get timer
  handleGetDefaultTime() {
    return this.model.getDefaultTime();
  }

  // delete task
  handleDeleteTask(target) {
    if (target.matches('.burger-popup__delete-button')) {
      const taskId = target.closest('.pomodoro-tasks__list-task').dataset.id;
      this.model.deleteTask(taskId);
      return true;
    }
  }

  // edit task
  handleEditTask(target) {
    if (target.matches('.burger-popup__edit-button')) {
      const taskTitle = target
        .closest('.pomodoro-tasks__list-task')
        .querySelector('.pomodoro-tasks__task-text span');

      // make task editable
      taskTitle.setAttribute('contenteditable', 'true');

      return true;
    }
  }

  // make task not editable
  handleSaveAfterBlurTask(titleElement, newTitle, taskId) {
    this.model.changeTitle(taskId, newTitle);
    titleElement.setAttribute('contenteditable', 'false');
  }
}

export {
  ControllerTomato
};
