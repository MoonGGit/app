// NAV 이동 이벤트
function handleNav(target) {
  store.navAnnotation.hide();
  store.titleAnnotation.hide();

  var tabId = target.dataset.tabId;
  document.querySelector("[id*=tab].show").classList.remove("show");
  document.querySelector("#tab-" + tabId).classList.add("show");

  if (tabId == 3) {
    document.querySelector(".fixed-btn-area").style.display = "none";
  } else {
    document.querySelector(".fixed-btn-area").style.display = "block";
  }

  store.tabId = tabId;

  // view highlighting
  store.navAnnotation = RoughNotation.annotate(target.querySelector("span"), {
    type: "highlight",
    color: "red",
  });
  store.titleAnnotation = RoughNotation.annotate(
    document.querySelector("#tab-" + tabId + " .title"),
    {
      type: "highlight",
      color: "red",
    }
  );

  store.navAnnotation.show();
  store.titleAnnotation.show();
}

// 더보기(More) 이벤트
function handleMore(target) {
  Ajax({
    method: "get",
    url:
      "https://my-json-server.typicode.com/arahansa/todojsmockdata/" +
      ++store.page,
    async: true,
    dataType: "json",
    success: function (res) {
      var list = document.querySelector("#tab-1 ul");
      var date = getCurTime().format("yyyy.MM.dd");

      for (const data of res) {
        data.date = date;
        var listElement = todoList(data);
        store.annotation[data.id] = RoughNotation.annotate(
          listElement.querySelector("input[type=text]"),
          {
            type: "strike-through",
            color: "red",
          }
        );
        list.appendChild(listElement);

        if (data.completed) {
          store.annotation[data.id].show();
        }

        if (data.id > store.getTodayId()) {
          store.setTodayId(data.id);
        }

        store.setToday(store.getToday().concat(data));
      }
    },
    error: function (err) {
      if (store.page > 3) {
        target.remove();
      } else {
        console.log("c% Unknown Error Occured :" + err, "color: red");
      }
    },
    button: target,
  });
}

// 할 일 완료(체크) 이벤트
function handleDidIt(event) {
  var checked = this.checked;
  var id = this.closest("li").id.split("-")[1];
  var list = store.tabId == 1 ? store.getToday() : store.getSomeday();

  if (checked) {
    store.annotation[id].show();
    this.nextElementSibling.disabled = true;
  } else {
    store.annotation[id].hide();
    this.nextElementSibling.disabled = false;
  }

  for (var i = 0; i < list.length; i++) {
    if (list[i].id == id) {
      list[i].completed = checked;

      if (store.tabId == 1) {
        store.setToday(function (preData) {
          preData[i] = list[i];
          store.setToday(preData);
        });
      } else {
        store.setSomeday(function (preData) {
          preData[i] = list[i];
          store.setSomeday(preData);
        });
      }
      break;
    }
  }
}

// 입력 이벤트
function handleInput(event) {
  var id = this.closest("li").id.split("-")[1];

  // 데이터 저장
  if (store.tabId == 1) {
    store.setToday(
      function (preData) {
        for (var i = 0; i < preData.length; i++) {
          if (preData[i].id == id) {
            preData[i].title = this.value;
            store.setToday(preData);

            break;
          }
        }
      }.bind(this)
    );
  } else {
    store.setSomeday(
      function (preData) {
        for (var i = 0; i < preData.length; i++) {
          if (preData[i].id == id) {
            preData[i].title = this.value;
            store.setSomeday(preData);

            break;
          }
        }
      }.bind(this)
    );
  }
}

// 오늘 할 일/미루기 이벤트
function handlePostpone(event) {
  var listElement = this.closest("li");
  var id = listElement.id.split("-")[0];

  if (this.classList.contains("someday")) {
    var list = document.querySelector("#tab-1 ul");
    list.appendChild(listElement);
    this.textContent = "미루기";
    this.classList.remove("someday");
  } else {
    var list = document.querySelector("#tab-2 ul");
    list.appendChild(listElement);
    this.textContent = "오늘 할 일";
    this.classList.add("someday");
  }
}

// 버리기 이벤트
function handleDelete(event) {
  var listElement = this.closest("li");
  var list = document.querySelector("#tab-3 ul");

  list.appendChild(listElement);

  listElement.querySelector("input[type=checkbox]").disabled = true;
  listElement.querySelector("input[type=text]").disabled = true;
  for (const btn of listElement.querySelectorAll("button")) {
    btn.remove();
  }
}

// 할 일 추가(행 추가) 이벤트
function handleAddWork(target) {
  var listWrapper = document.querySelector(
    ".main-content #tab-" + store.tabId + " ul"
  );
  var data = {
    id:
      store.getTodayId() >= store.getSomedayId()
        ? store.getTodayId() + 1
        : store.getSomedayId() + 1,
    completed: false,
    title: "",
  };

  if (store.tabId == 1) {
    data.date = getCurTime().format("yyyy.MM.dd");
    store.setToday(store.getToday().concat(data));
    store.setTodayId(data.id);
  } else {
    store.setSomeday(store.getSomeday().concat(data));
    store.setSomedayId(data.id);
  }

  listWrapper.appendChild(todoList(data));
}

// 밤/낮 테마변경 이벤트
// function handleTheme(target) {}
