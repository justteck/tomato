export default class Task {
  #title;
  #count;
  #id;
  constructor(title, count = 0) {
    this.#title = title;
    this.#count = count;
    this.#id = this.setId();
  }

  // id
  setId() {
    return Date.now().toString();
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
}
