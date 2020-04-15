// LOCAL STORAGE
function saveLocalTodos(todo) {
  // Check if I have todos in my storage
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

// SHOWING LOCAL STORAGE ITEM WHEN RELOADED

function getTodos(e) {
  event.preventDefault();
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    const newTodo = document.createElement("li");
    newTodo.innerHTML = svg;
    newTodo.classList.add("li-clicked");
    newTodo.classList.add("draggable");
    newTodo.setAttribute("draggable", true);
    const newDiv = document.createElement("div");
    newDiv.innerHTML =
      `<h2 class="header-clicked">` +
      todo +
      `</h2>
      <button class="remove-todo"><i class="far fa-trash-alt"></i>Remove</button>`;
    newDiv.classList.add("li-content");
    newTodo.appendChild(newDiv);
    todoList.appendChild(newTodo);

    updateTodoList(); // UPDATING THING TO DO TOTAL COUNT
    containerHeight();
  });
}

// REMOVE TODO FROM STORAGE
function removeLocalStorage(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].textContent;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}
