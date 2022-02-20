// Todo List Element
function todoList(data) {
  var li = document.createElement("li");
  li.id = "todo-" + data.id;

  var cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = data.completed;
  cb.onchange = handleDidIt.bind(cb);

  var inp = document.createElement("input");
  inp.type = "text";
  inp.maxLength = 80;
  inp.value = data.title;
  inp.oninput = handleInput.bind(inp);

  var btnPostpone = document.createElement("button");
  btnPostpone.onclick = handlePostpone.bind(btnPostpone);
  btnPostpone.textContent = data.date == undefined ? "오늘 할 일" : "미루기";
  btnPostpone.className =
    "postpone" + (data.date == undefined ? " someday" : "");

  var btnDelete = document.createElement("button");
  btnDelete.onclick = handleDelete.bind(btnDelete);
  btnDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

  li.appendChild(cb);
  li.appendChild(inp);
  li.appendChild(btnPostpone);
  li.appendChild(btnDelete);

  return li;
}
