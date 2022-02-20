// event initializing
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".loading-area").classList.add("show");

  // global store
  window.store = new _store();
  store.tabId = 1;
  store.annotation = [];

  // view highlighting
  store.navAnnotation = RoughNotation.annotate(
    document.querySelector("#nav-1 span"),
    {
      type: "highlight",
      color: "red",
    }
  );
  store.titleAnnotation = RoughNotation.annotate(
    document.querySelector("#tab-1 .title"),
    {
      type: "highlight",
      color: "red",
    }
  );

  // data(1page) from server
  Ajax({
    method: "get",
    url: "https://my-json-server.typicode.com/arahansa/todojsmockdata/1",
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

      store.page = 1;

      document.querySelector(".loading-area").classList.remove("show");
      store.navAnnotation.show();
      store.titleAnnotation.show();
    },
    error: function (err) {
      console.log("c% Unknown Error Occured :" + err, "color: red");
    },
  });
});
