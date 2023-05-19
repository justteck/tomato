import './scss/index.scss';
import './index.html';

import {
  Tomato,
  LowTask,
  StandardTask,
  HighTask
} from './js/model';

import {RenderTomato} from './js/view';
import { elements } from './js/view/elements';
import { ControllerTomato } from './js/controller';

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
const render = new RenderTomato(elements);

// model.render = render;
// console.log(model);

// model.operation('add', new LowTask('wake up'));
// model.operation('add', new StandardTask('eat'));
// model.operation('add', new HighTask('sleep'));

// model.activateTask(model.getTasks()[1].getId());
// console.log('TEST', new StandardTask('eat').getTitle());

// console.log('CUR ACTIVE', model.getActiveTaskTitle());

// model.runmodelTask();
