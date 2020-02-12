'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const todoControl = document.querySelector('.todo-control');
  const headerInput = document.querySelector('.header-input');
  const todoList = document.getElementById('todo');
  const completedList = document.getElementById('completed');


  // объект для хранения данных
  let data = {
    todo: [],
    completed: []
  };

  // проверяем, есть ли данные в localStorage
  if (localStorage.getItem('localData')) {
    data = JSON.parse(localStorage.getItem('localData'));
  }

  // функция, которая рендерит данные, если они есть в localStorage
  const renderItemsForUpdate = function () {
    if (!data.todo && !data.completed) {
      return;
    }

    for (let i = 0; i < data.todo.length; i++) {
      renderItem(data.todo[i]);
    }

    for (let i = 0; i < data.completed.length; i++) {
      renderItem(data.completed[i], true);
    }
  };

  // получаем текст, запускаем рендер одного элемента
  const addItem = function (text) {
    renderItem(text);
    headerInput.value = '';
    data.todo.push(text);

    // обновляем данные в localStorage
    dataUpdateToLocalStorage();
  };

  // создаём элемент, помещаем в него нужные классы и контент
  const renderItem = function (text, completed = false) {

    // блок создания элементов
    const item = document.createElement('li');
    const btnBlock = document.createElement('div');
    const btnRemove = document.createElement('button');
    const btnComplete = document.createElement('button');

    // блок назначения классов элементам
    item.classList.add('todo-item');
    btnBlock.classList.add('todo-buttons');
    btnRemove.classList.add('todo-remove');
    btnComplete.classList.add('todo-complete');

    // блок заполнения контентом (текст/элементы)
    item.textContent = text;

    btnBlock.appendChild(btnRemove);
    btnBlock.appendChild(btnComplete);
    item.appendChild(btnBlock);

    // слушаем клики по кнопкам "удалить"/"готово"
    btnRemove.addEventListener('click', function (event) {
      itemRemove(event.target);
    });

    btnComplete.addEventListener('click', function (event) {
      itemComplete(event.target);
    });

    // блок создания списков элементов
    let list;

    if (completed) {
      list = completedList;
    } else {
      list = todoList;
    }

    // выводим на экран
    list.insertBefore(item, list.childNodes[0]);
  };

  // обработчик сабмита
  todoControl.addEventListener('submit', function (event) {
    event.preventDefault();

    if (headerInput.value !== '') {
      addItem(headerInput.value.trim())
    }
  });

  // функция, которая вносит данные в localStorage
  const dataUpdateToLocalStorage = function () {
    localStorage.setItem('localData', JSON.stringify(data));
  };

  // получаем родителя конкретного этемента и удаляем его дитя (конкретный элемент)
  const itemRemove = function (elem) {
    const item = elem.parentNode.parentNode;
    const itemParent = item.parentNode;
    const id = itemParent.id;
    const text = item.textContent;

    itemParent.removeChild(item);

    if (id === 'todo') {
      data.todo.splice(data.todo.indexOf(text), 1);
    } else {
      data.completed.splice(data.completed.indexOf(text), 1);
    }

    // обновляем данные в localStorage
    dataUpdateToLocalStorage();
  };

  // переносит элемент в противороложный список
  const itemComplete = function (elem) {
    const item = elem.parentNode.parentNode;
    const itemParent = item.parentNode;
    const id = itemParent.id;
    const text = item.textContent;

    let target;

    if (id === 'todo') {
      target = completedList;
    } else {
      target = todoList;
    }

    itemParent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);

    if (id === 'todo') {
      data.todo.splice(data.todo.indexOf(text), 1);
      data.completed.push(text);
    } else {
      data.completed.splice(data.completed.indexOf(text), 1);
      data.todo.push(text);
    }


    // обновляем данные в localStorage
    dataUpdateToLocalStorage();
  };

  // вызов функции, которая рендерит данные, если они есть в locaiStorage
  renderItemsForUpdate();

});
