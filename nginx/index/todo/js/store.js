// store property
var _store = function () {
  this._todo = {
    _today: [],
    _todayId: 0,
    _someday: [],
    _somedayId: 0,
    _trash: [],
  };
};

// store property getter/setter
_store.prototype = {
  getToday: function () {
    return deepCopy(this._todo._today);
  },
  setToday: function (today) {
    if (typeof today == "function") {
      today(deepCopy(this._todo._today));
    } else {
      this._todo._today = today;
    }
  },
  getTodayId: function () {
    return this._todo._todayId;
  },
  setTodayId: function (id) {
    this._todo._todayId = id;
  },

  getSomeday: function () {
    return deepCopy(this._todo._someday);
  },
  setSomeday: function (someday) {
    if (typeof someday == "function") {
      someday(deepCopy(this._todo._someday));
    } else {
      this._todo._someday = someday;
    }
  },
  getSomedayId: function () {
    return this._todo._somedayId;
  },
  setSomedayId: function (id) {
    this._todo._somedayId = id;
  },

  setTrash: function (work) {
    this._todo._trash.push(work);
  },
};
