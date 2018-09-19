const commandEl = document.getElementById("command")
const contentEl = document.getElementById("content")
const boardEl = document.getElementById("board")
const todoEl = document.getElementById("todo")
const doingEl = document.getElementById("doing")
const doneEl = document.getElementById("done")

document.getElementById("submit").addEventListener("click", inputCommand)
let tasks = []

function inputCommand () {
  let commandValue = commandEl.value
  let commands = commandValue.split(" ")
  const action = commands[0]
  const rest = commandValue.substring(action.length + 2, commandValue.length - 1)

  if (action == "create") {
    const currentLength = tasks.length
    tasks.push({id: currentLength + 1, name: rest, type: 'todo'})
  } else if (action == "move") {
    const id = commands[1]
    const target = commands[2]
    const targets = ["todo", "doing", "done"]
    if (targets.indexOf(target) > -1) {
      moveTask(id, target)
    } else { alert(`Sorry, only ${targets.join(", ")} are allowed`) }
    
  } else if (action == "remove") {
    const id = commands[1]
    removeTask(id)
  }

  render()
}

function moveTask (id, target) {
  const index = tasks.findIndex(val => val.id == id)
  if (index > -1) {
    tasks[index] = {...tasks[index], type: target}
  }
  render()
}

function removeTask (id) {
  const index = tasks.findIndex(val => val.id == id)
  if (index > -1) {
    const removeConfirm = confirm("Remove task #" + id + "?")
    if (removeConfirm == true) {
      moveTask(id, 'deleted')
    }  
  } else {
    alert("Tidak ada task untuk ID tersebut")
  }
  
}

function render () {
  renderTasks()
}

function renderTasks () {
  doingEl.innerHTML = ""
  todoEl.innerHTML = ""
  doneEl.innerHTML = ""

  tasks.map(val => {
    const taskDiv = document.createElement("DIV")
    const taskText = document.createTextNode(`#${val.id} ${val.name}`)
    taskDiv.classList.add("task")
    taskDiv.setAttribute("id", `task-${val.id}`)
    taskDiv.setAttribute("draggable", true)
    taskDiv.addEventListener("dragstart", drag)
    taskDiv.appendChild(taskText)

    if (val.type == 'todo') {
      todoEl.appendChild(taskDiv)
    }
    if (val.type == 'doing') {
      doingEl.appendChild(taskDiv)
    }
    if (val.type == 'done') {
      doneEl.appendChild(taskDiv)
    }
  })
}


function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("id", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("id");
  const tasks = id.split("-")
  const targetId = ev.target.id
  if (targetId == 'add-todo') {
    moveTask(tasks[1], 'todo')
  } else if (targetId == 'add-doing') {
    moveTask(tasks[1], 'doing')
  } else if (targetId == 'add-done') {
    moveTask(tasks[1], 'done')
  } else if (targetId == 'remove') {
    removeTask(tasks[1])
  }
}

render()