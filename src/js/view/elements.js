// list
const tasksList = document.querySelector('.pomodoro-tasks__quest-tasks');
const taskListItems = document.querySelectorAll('.pomodoro-tasks__list-task');
const taskPopUp = document.querySelector('.burger-popup_active');
const popupBtns = document.querySelectorAll('.pomodoro-tasks__task-button');

// active
const activeTaskTitle = document.querySelector('.window__panel-title');
const activeTaskCount = document.querySelector('.window__panel-task-text');

// form
const taskForm = document.querySelector('.task-form');
const taskFormInput = taskForm.querySelector('#task-name');
const addBtnImportance = document.querySelector('.button-importance');

// timer
const timer = document.querySelector('.window__timer-text');

const minutes = timer.querySelector('.min');
const seconds = timer.querySelector('.sec');

const startBtn = document.querySelector('.window__body').querySelector('.button-primary');

const stopBtn = document.querySelector('.window__body').querySelector('.button-secondary');

// total
const totalTime = document.querySelector('.pomodoro-tasks__deadline-timer');

export const elements = {
  tasksList,
  taskListItems,
  taskPopUp,
  popupBtns,
  activeTaskCount,
  activeTaskTitle,
  taskForm,
  taskFormInput,
  addBtnImportance,
  timer,
  minutes,
  seconds,
  startBtn,
  stopBtn,
  totalTime,
};
