const todoList = document.querySelector(".todo-list");
const todoButton = document.querySelector(".todo-button");
const todoInput = document.querySelector(".todo-input");
const progressList = document.querySelector(".in-progress-list");
const doneList = document.querySelector(".done-list");
const total = document.querySelector(".todo-total");
const doneTotal = document.querySelector(".done-total");
const progressTotal = document.querySelector(".progress-total");
const removeButton = document.querySelector(".remove-todo");

// ADDING EVENT LISTENERS
document.addEventListener("DOMContentLoaded", getTodos);
document.addEventListener("DOMContentLoaded", renderProgressTodos);
document.addEventListener("DOMContentLoaded", renderDoneTodos);

todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", checked);
progressList.addEventListener("click", checked);
doneList.addEventListener("click", checked);

const svg = `<svg class="svg" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g class="check-box">
    <path class="vector" d="M16 0C7.17725 0 0 7.17725 0 16C0 24.8228 7.17725 32 16 32C24.8228 32 32 24.8228 32 16C32 7.17725 24.8228 0 16 0Z" fill="#e8e8e8" />

    <path class="tick" d="M24.1094 12.6094L15.4426 21.2759C15.1826 21.5359 14.8413 21.6667 14.5 21.6667C14.1587 21.6667 13.8174 21.5359 13.5574 21.2759L9.22412 16.9426C8.70264 16.4214 8.70264 15.5786 9.22412 15.0574C9.74536 14.5359 10.5879 14.5359 11.1094 15.0574L14.5 18.448L22.2241 10.7241C22.7454 10.2026 23.5879 10.2026 24.1094 10.7241C24.6306 11.2454 24.6306 12.0879 24.1094 12.6094V12.6094Z" fill="#FAFAFA" />

</g>
</svg>`;

function addAlert() {
  const span = document.createElement("li");
  span.innerText = "Item Already Exits";
  span.classList.add("dragMark");
  todoList.insertBefore(span, todoList.childNodes[0]);
  setTimeout(function () {
    const alert = document.querySelector(".dragMark");
    alert.remove();
  }, 2000);
}

updateTodoList(); // UPDATING THING TO DO TOTAL COUNT
updateDoneList(); // UPDATING DONE LIST TOTAL COUNT
updateProgressCounter(); // UPDATING PROGRESS LIST TOTAL COUNT

// ADDING TODO ITEM TO
function addTodo(event) {
  event.preventDefault();

  if (JSON.parse(localStorage.getItem("todos")) != null) {
    if (todos.includes(todoInput.value)) {
      addAlert();
      todoInput.value = "";
    } else if (todoInput.value != "") {
      const newTodo = document.createElement("li");
      newTodo.innerHTML = svg;
      newTodo.classList.add("li-clicked");
      newTodo.classList.add("draggable");
      newTodo.setAttribute("draggable", true);
      const newDiv = document.createElement("div");
      newDiv.innerHTML =
        `<h2 class="header-clicked">` +
        todoInput.value +
        `</h2>
      <button class="remove-todo"><i class="far fa-trash-alt"></i>Remove</button>`;
      // ADD LOCAL STORAGE
      saveLocalTodos(todoInput.value);
      newDiv.classList.add("li-content");
      newTodo.appendChild(newDiv);
      todoList.appendChild(newTodo);

      updateTodoList(); // UPDATING THING TO DO TOTAL COUNT
      containerHeight();
      todoInput.value = ""; // RESETTING FORM VALUE AFTER SUBMIT
    }
  } else if (todoInput.value != "") {
    const newTodo = document.createElement("li");
    newTodo.innerHTML = svg;
    newTodo.classList.add("li-clicked");
    newTodo.classList.add("draggable");
    newTodo.setAttribute("draggable", true);
    const newDiv = document.createElement("div");
    newDiv.innerHTML =
      `<h2 class="header-clicked">` +
      todoInput.value +
      `</h2>
    <button class="remove-todo"><i class="far fa-trash-alt"></i>Remove</button>`;
    // ADD LOCAL STORAGE
    saveLocalTodos(todoInput.value);
    newDiv.classList.add("li-content");
    newTodo.appendChild(newDiv);
    todoList.appendChild(newTodo);

    updateTodoList(); // UPDATING THING TO DO TOTAL COUNT
    containerHeight();
    todoInput.value = ""; // RESETTING FORM VALUE AFTER SUBMIT
  }
}

//li CLICK EVENTS FUNCTION
function checked(e) {
  const item = e.target;

  // CHECK SVG ANIMATE
  if (item.classList[0] === "svg") {
    // FINDING THE CHILDREN OF THE SVG TO ANIMATE
    const gdiv = item.children[0];
    const tick = gdiv.children[1];
    const vector = gdiv.children[0];
    vector.classList.add("boxchecked");
    tick.classList.add("checked");

    // FINDING THE LI OF THE SVG
    const parent = item.parentElement;
    parent.addEventListener("transitionend", function () {
      // ADDING THE LI TO DONE LIST
      const liDiv = parent.children[1];
      const ulDiv = parent.parentElement;

      if (ulDiv === todoList) {
        removeLocalStorage(liDiv);
      }
      if (ulDiv === progressList) {
        removeProgressStorage(liDiv);
      }

      doneList.appendChild(parent);
      parent.classList.add("done");
      item.classList.add("active");

      saveDoneList(liDiv.children[0].textContent);

      // REMOVE GREEN CHECK WHEN LI IS MOVED OUT OF DONELIST
      vector.classList.remove("boxchecked");
      tick.classList.remove("checked");

      updateDoneList();
      updateTodoList(); // UPDATING THING TO DO TOTAL COUNT
      updateProgressCounter(); // UPDATING PROGRESS LIST TOTAL COUNT
      containerHeight();
    });
  }

  // TOGGLE BUTTON WHEN LI IS CLICKED
  if (item.classList[0] === "li-clicked") {
    const firstChild = item.children[1];
    const button = firstChild.children[1];
    button.classList.toggle("reveal");
  }

  // TOGGLE BUTTON WHEN H2 IS CLICKED
  if (item.classList[0] === "header-clicked") {
    const parent = item.parentElement;
    const button = parent.children[1];
    button.classList.toggle("reveal");
  }

  // DELETE BUTTON
  if (item.classList[0] === "remove-todo") {
    const parent = item.parentElement;
    const list = parent.parentElement;
    const ulDiv = list.parentElement;
    list.classList.add("fall");
    if (ulDiv === todoList) {
      removeLocalStorage(parent);
    }
    if (ulDiv === progressList) {
      removeProgressStorage(parent);
    }
    if (ulDiv === doneList) {
      removeDoneStorage(parent);
    }

    list.addEventListener("transitionend", function () {
      list.remove();
      containerHeight();
      updateProgressCounter();
      updateTodoList(); // UPDATING THING TO DO TOTAL COUNT
      updateDoneList(); // UPDATING DONE LIST TOTAL COUNT
    });
  }
}

// FUNCTION FOR UPDATING THING TO DO TOTAL COUNT
function updateTodoList() {
  const newTotal = document.createElement("span");
  newTotal.classList.add("progressNr");
  const Totalno = document.createElement("span");
  todos = JSON.parse(localStorage.getItem("todos"));
  if (todos === null) {
    todos = [];
  }
  const length = todos.length;
  if (length > 0) {
    total.children[1].remove();
    Totalno.innerHTML = "<a>" + length + "</a>";
    newTotal.appendChild(Totalno);
    total.appendChild(newTotal);
  } else {
    total.children[1].remove();
    Totalno.innerHTML = "<a>" + length + "</a>";
    newTotal.appendChild(Totalno);
    total.appendChild(newTotal);
  }
}

// FUNCTION FOR UPDATING DONE TOTAL COUNT
function updateDoneList() {
  const newTotal = document.createElement("span");
  newTotal.classList.add("progressNr");
  const Totalno = document.createElement("span");
  doneTodos = JSON.parse(localStorage.getItem("doneTodos"));

  if (doneTodos === null) {
    doneTodos = [];
  }
  const length = doneTodos.length;
  if (length > 0) {
    doneTotal.children[1].remove();
    Totalno.innerHTML = "<a>" + length + "</a>";
    newTotal.appendChild(Totalno);
    doneTotal.appendChild(newTotal);
  } else {
    doneTotal.children[1].remove();
    Totalno.innerHTML = "<a>" + length + "</a>";
    newTotal.appendChild(Totalno);
    doneTotal.appendChild(newTotal);
  }
}

// FUNCTION FOR UPDATING PROGRESS TOTAL COUNT
function updateProgressCounter() {
  const newTotal = document.createElement("span");
  newTotal.classList.add("progressNr");
  const Totalno = document.createElement("span");
  progressTodos = JSON.parse(localStorage.getItem("progressTodos"));
  if (progressTodos === null) {
    progressTodos = [];
  }
  const length = progressTodos.length;
  if (length > 0) {
    progressTotal.children[1].remove();
    Totalno.innerHTML = "<a>" + length + "</a>";
    newTotal.appendChild(Totalno);
    progressTotal.appendChild(newTotal);
  } else {
    progressTotal.children[1].remove();
    Totalno.innerHTML = "<a>" + length + "</a>";
    newTotal.appendChild(Totalno);
    progressTotal.appendChild(newTotal);
  }
}
// LOCAL STORAGE
function saveLocalTodos(todo) {
  // Check if I have todos in my storage
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  if (!todos.includes(todo)) {
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

// SHOWING LOCAL STORAGE ITEM WHEN RELOADED

function getTodos() {
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

// REMOVE TODO FROM TODO LIST STORAGE
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

// CREATE PROGRESS LOCAL STORAGE
function saveProgressList(todo) {
  let progressTodos;
  if (localStorage.getItem("progressTodos") === null) {
    progressTodos = [];
  } else {
    progressTodos = JSON.parse(localStorage.getItem("progressTodos"));
  }
  if (!progressTodos.includes(todo)) {
    progressTodos.push(todo);
    localStorage.setItem("progressTodos", JSON.stringify(progressTodos));
  }
}

// RENDER THE progressList STORAGE WHEN RELOADED
function renderProgressTodos() {
  let progressTodos;
  if (localStorage.getItem("progressTodos") === null) {
    progressTodos = [];
  } else {
    progressTodos = JSON.parse(localStorage.getItem("progressTodos"));
  }
  progressTodos.forEach(function (todo) {
    const newTodo = document.createElement("li");
    newTodo.innerHTML = svg;
    newTodo.classList.add("li-clicked");
    newTodo.classList.add("progress");
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
    progressList.appendChild(newTodo);

    updateTodoList(); // UPDATING THING TO DO TOTAL COUNT
    containerHeight();
  });
}

// REMOVE ITEM FROM PROGRESS LIST STORAGE
function removeProgressStorage(todo) {
  let progressTodos;
  if (localStorage.getItem("progressTodos") === null) {
    progressTodos = [];
  } else {
    progressTodos = JSON.parse(localStorage.getItem("progressTodos"));
  }
  const todoIndex = todo.children[0].textContent;
  progressTodos.splice(progressTodos.indexOf(todoIndex), 1);
  localStorage.setItem("progressTodos", JSON.stringify(progressTodos));
}

// STORAGE FOR DONE LIST
function saveDoneList(todo) {
  let doneTodos;
  if (localStorage.getItem("doneTodos") === null) {
    doneTodos = [];
  } else {
    doneTodos = JSON.parse(localStorage.getItem("doneTodos"));
  }
  if (!doneTodos.includes(todo)) {
    doneTodos.push(todo);
    localStorage.setItem("doneTodos", JSON.stringify(doneTodos));
  }
}

// RENDER THE doneList STORAGE WHEN RELOADED
function renderDoneTodos() {
  let doneTodos;
  if (localStorage.getItem("doneTodos") === null) {
    doneTodos = [];
  } else {
    doneTodos = JSON.parse(localStorage.getItem("doneTodos"));
  }
  doneTodos.forEach(function (todo) {
    const newTodo = document.createElement("li");
    const svgActive = `<svg class="svg active" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g class="check-box">
        <path class="vector" d="M16 0C7.17725 0 0 7.17725 0 16C0 24.8228 7.17725 32 16 32C24.8228 32 32 24.8228 32 16C32 7.17725 24.8228 0 16 0Z" fill="#e8e8e8" />

        <path class="tick" d="M24.1094 12.6094L15.4426 21.2759C15.1826 21.5359 14.8413 21.6667 14.5 21.6667C14.1587 21.6667 13.8174 21.5359 13.5574 21.2759L9.22412 16.9426C8.70264 16.4214 8.70264 15.5786 9.22412 15.0574C9.74536 14.5359 10.5879 14.5359 11.1094 15.0574L14.5 18.448L22.2241 10.7241C22.7454 10.2026 23.5879 10.2026 24.1094 10.7241C24.6306 11.2454 24.6306 12.0879 24.1094 12.6094V12.6094Z" fill="#FAFAFA" />

    </g>
    </svg>`;
    newTodo.innerHTML = svgActive;
    newTodo.classList.add("li-clicked");
    newTodo.classList.add("done");
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
    doneList.appendChild(newTodo);

    updateTodoList(); // UPDATING THING TO DO TOTAL COUNT
    containerHeight();
  });
}

// REMOVE ITEM FROM DONE LIST STORAGE
function removeDoneStorage(todo) {
  let doneTodos;
  if (localStorage.getItem("doneTodos") === null) {
    doneTodos = [];
  } else {
    doneTodos = JSON.parse(localStorage.getItem("doneTodos"));
  }
  const todoIndex = todo.children[0].textContent;
  doneTodos.splice(doneTodos.indexOf(todoIndex), 1);
  localStorage.setItem("doneTodos", JSON.stringify(doneTodos));
}
