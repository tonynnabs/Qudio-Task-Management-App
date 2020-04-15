const todoListDrag = document.querySelector(".todo-list");
const doneListDrag = document.querySelector(".done-list");
const progressListDrag = document.querySelector(".in-progress-list");
const containers = document.querySelectorAll(".container");
const todoButtonDrag = document.querySelector(".todo-button");

document.addEventListener("DOMContentLoaded", containerHeight);

// MAKING LIST UL DRAGGabble WHEN PAGE LOAD
todoListDrag.addEventListener("mouseover", function () {
  overList();
});

progressListDrag.addEventListener("mouseover", function () {
  overList();
});

doneListDrag.addEventListener("mouseover", function () {
  overList();
});
// MAKING LIST UL DRAG WHEN PAGE LOAD END

// ADDING DROPPED ITEMS TO CORRECT LIST LOCAL STORAGE
progressListDrag.addEventListener("drop", function () {
  const draggable = document.querySelector(".dragging");
  const div = draggable.children[1];
  const text = div.children[0];
  saveProgressList(text.textContent);
  updateProgressCounter();
});
todoListDrag.addEventListener("drop", function () {
  const draggable = document.querySelector(".dragging");
  const div = draggable.children[1];
  const text = div.children[0];
  saveLocalTodos(text.textContent);
});
doneListDrag.addEventListener("drop", function () {
  const draggable = document.querySelector(".dragging");
  const div = draggable.children[1];
  const text = div.children[0];
  saveDoneList(text.textContent);
});

// REMOVING ITEM THAT WAS DUPLICATED
containers.forEach((container) => {
  // add container height when empty
  container.addEventListener("drag", function () {
    const containers = document.querySelectorAll(".container");
    containers.forEach((container) => {
      const children = container.children;
      const lengthOfChildren = children.length;
      if (lengthOfChildren <= 0) {
        container.style.height = "80px";
      } else {
        container.style.height = "auto";
      }
    });
  });
  container.addEventListener("drop", function () {
    const draggable = document.querySelector(".dragging");
    const ulDiv = draggable.parentElement;
    const div = draggable.children[1];
    const text = div.children[0];
    if (ulDiv !== progressListDrag) {
      progressTodos = JSON.parse(localStorage.getItem("progressTodos"));
      if (progressTodos === null) {
        progressTodos = [];
      } else if (progressTodos.includes(text.textContent)) {
        removeProgressStorage(div);
      }
    }
    if (ulDiv !== todoListDrag) {
      todos = JSON.parse(localStorage.getItem("todos"));
      if (todos.includes(text.textContent)) {
        removeLocalStorage(div);
      }
    }

    if (ulDiv !== doneListDrag) {
      doneTodos = JSON.parse(localStorage.getItem("doneTodos"));
      if (doneTodos === null) {
        doneTodos = [];
      } else if (doneTodos.includes(text.textContent)) {
        removeDoneStorage(div);
      }
    }
  });
});

//  AUTO GIVE CONTAINER HEIGHT WHEN EMPTY
function containerHeight() {
  containers.forEach((container) => {
    const children = container.children;
    const lengthOfChildren = children.length;
    if (lengthOfChildren <= 0) {
      container.style.height = "80px";
    } else {
      container.style.height = "auto";
    }
  });
}

function overList() {
  const draggables = document.querySelectorAll(".draggable");
  draggables.forEach((draggable) => {
    //   CONTAINER HEIGHT
    containerHeight();
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
      updateTodoList(); // UPDATING THING TO DO TOTAL COUNT
      updateDoneList();
      updateProgressCounter();
    });
  });
}

containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();

    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");

    // ADDING GREEN BORDER WHEN INSIDE DONE LIST
    if (container === doneListDrag) {
      draggable.classList.add("done");
      const svg = draggable.children[0];
      svg.classList.add("active");
    } else {
      draggable.classList.remove("done");
      const svg = draggable.children[0];
      svg.classList.remove("active");
    }

    // ADDING YELLO BORDER WHEN INSIDE PROGRESS LIST
    if (container === progressListDrag) {
      draggable.classList.add("progress");
    } else {
      draggable.classList.remove("progress");
    }

    // ADDING YELLO BORDER WHEN INSIDE PROGRESS LIST END

    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
