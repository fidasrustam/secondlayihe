let sortIcon = document.querySelectorAll(".sort");
let deleteIcon = document.querySelector(".delete");
let todos = document.querySelector(".todos");
let plusIcon = document.querySelector(".plus");
let inputContainer = document.querySelector(".input");
let sortDownIcon = document.querySelector(".sort-down");
let sortUpIcon = document.querySelector(".sort-up");
let error = document.querySelector(".error");
sortUpIcon.style.display = "none";
let addButton = document.querySelector(".button");
addButton.disabled = false;
addButton.addEventListener('click', () =>{
    todos.classList.add("new-todos");
})

deleteIcon.addEventListener("click", () => {
  inputContainer.style.display = "none";
  addButton.disabled = true;
  if (todoss.length > 0) {
    todos.style.display = "block";
  }
  inputContainer.style.display = "block";
  todos.innerHTML = ""; 
  this.displayTodos();  
});

plusIcon.addEventListener("click", (e) => {
  inputContainer.style.display = "block";
  todos.style.display = "none";
  addButton.disabled = false;
  e.preventDefault();
});

let todoss = [];

class Todo {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }
}

class List {     
  constructor() {
    this.input = document.querySelector("input");
    this.btn = document.querySelector(".button");
    this.sorted = true;
    this.editingId = null;

    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.addTodo();
      }
    });

    this.btn.addEventListener("click", (e) => {
      this.addTodo();
      e.preventDefault();
    });
  }

  addTodo = () => {
    let todoText = this.input.value.trim();
    if (todoText) {
      if (this.editingId) {
        let todo = todoss.find((todo) => todo.id === this.editingId);
        todo.name = todoText;
        this.editingId = null;
      } else {
        let newTodo = new Todo(todoText, Date.now());
        todoss.push(newTodo);
      }
  
      this.displayTodos();
      inputContainer.style.display = "none";
      todos.style.display = "block";
      addButton.disabled = true;
  
      error.textContent = ""; 
    } 
    else {
      error.textContent = "Please add a todo item"; 
    }
    this.input.value = "";
  };

  displayTodos = () => {
    todos.innerHTML = "";
    let ul = document.createElement("ul");
    if (todoss.length === 0) {
      todos.style.display = "none";
      this.sorted = true;
      sortDownIcon.style.display = "block";
      sortUpIcon.style.display = "none";
    } else {
      todos.style.display = "block";
      todoss.forEach((todo, index) => {
let li = document.createElement("li");
let span = document.createElement("span");
let deleteButton = document.createElement("button"); 


span.textContent = `${index + 1}. ${todo.name}`;

deleteButton.classList.add("delete-todo");
deleteButton.textContent = "X";  
deleteButton.addEventListener("click", () => this.deleteTodo(todo.id));

li.draggable = true;
li.dataset.index = index;
li.addEventListener("dragstart", this.handleDragStart);
li.addEventListener("dragover", this.handleDragOver);
li.addEventListener("drop", this.handleDrop);
li.addEventListener("dragend", this.handleDragEnd);

li.addEventListener("dblclick", () => this.editTodo(todo.id));

li.appendChild(span);
li.appendChild(deleteButton);  
ul.appendChild(li);


      });
      todos.appendChild(ul);
    }
  };


  deleteTodo = (id) => {
    todoss = todoss.filter((todo) => todo.id !== id); 
    this.updateIndexes(); 
    this.displayTodos();

    if (todoss.length === 0) {
        inputContainer.style.display = "block"; 
        todos.style.display = "none";
        addButton.disabled = false; 
    }
};

updateIndexes = () => {
    todoss = todoss.map((todo, index) => {
      todo.index = index + 1; 
      return todo;
    });
};

  sortTodo = () => {
    if (todoss.length > 1) {
      todoss.sort((a, b) => {
        const isANumber = !isNaN(a.name);
        const isBNumber = !isNaN(b.name);

        if (isANumber && isBNumber) {
          return this.sorted ? a.name - b.name : b.name - a.name;
        } else if (!isANumber && !isBNumber) {
          return this.sorted
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else {
          return isANumber ? -1 : 1;
        }
      });

      this.sorted = !this.sorted;
      let sortdowndisplay = getComputedStyle(sortDownIcon).display;
      let sortupdisplay = getComputedStyle(sortUpIcon).display;
      sortDownIcon.style.display =
        sortdowndisplay === "none" ? "block" : "none";
      sortUpIcon.style.display = sortupdisplay === "block" ? "none" : "block";
      this.displayTodos();
    }
  };

  handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.dataset.index);
    e.target.style.opacity = "0.5";
  };
  handleDragOver = (e) => {
    e.preventDefault();
    e.target.style.border = "1px dashed #FFDC40";
  };
  handleDrop = (e) => {
    e.preventDefault();
    e.target.style.border = "";
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const targetIndex = parseInt(e.target.dataset.index, 10);
    if (draggedIndex !== targetIndex) {
        [todoss[draggedIndex], todoss[targetIndex]] = [
            todoss[targetIndex],
            todoss[draggedIndex],
        ];
        this.displayTodos();
    }
};
  handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    const items = todos.querySelectorAll("li");
    items.forEach((item) => (item.style.border = ""));
  };
}

let todo = new List();
sortIcon.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    todo.sortTodo();
  });
});