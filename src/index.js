import './scss/index.scss';
import './index.html';

import Task from './js/task';

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


// class test

const taskOne = new Task('drink tea');

console.log('id', taskOne.getId());
console.log('title', taskOne.getTitle());
console.log('count', taskOne.getCount());

taskOne.increaseCount().increaseCount().setTitle().setTitle('drink water');

console.log('id', taskOne.getId());
console.log('title', taskOne.getTitle());
console.log('count', taskOne.getCount());