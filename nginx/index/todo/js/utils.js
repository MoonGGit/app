// deepCopy obj or arr
function deepCopy(obj) {
  if (typeof obj != "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    var clone = [];

    for (var el of obj) {
      clone.push(deepCopy(el));
    }

    return clone;
  } else {
    var clone = {};

    for (var key in obj) {
      if (typeof obj[key] == "object" && obj[key] != null) {
        clone[key] = deepCopy(obj[key]);
      } else {
        clone[key] = obj[key];
      }
    }
    return clone;
  }
}

// Ajax object
/**
 * required parameter: method, url,
 * etc: async, contentType, dataType, data, success, error
 */
function Ajax() {
  var timer = Math.floor(Math.random() * 1000);
  console.time("Ajax[" + timer + "] Loading Time");
  var _ = arguments[0];
  var httpRequest = new XMLHttpRequest();
  httpRequest.open(_.method, _.url, _.async ? _.async : true);
  httpRequest.setRequestHeader("Content-Type", _.contentType);
  httpRequest.responseType = _.dataType ? _.dataType : "";
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState == XMLHttpRequest.DONE) {
      if (httpRequest.status == 200) {
        if (typeof _.success == "function") {
          _.success(httpRequest.response);
        } else {
          console.log("success method is c%" + typeof _.success, "color: red");
          console.log("received data :" + httpRequest.response);
        }
      } else {
        if (typeof _.error == "function") {
          _.error(httpRequest);
        } else {
          console.log("error method is c%" + typeof _.error, "color: red");
          console.log("error data :" + httpRequest);
        }
      }

      // button loading end
      if (_.button != undefined) {
        _.button.disabled = false;
        _.button.style.cursor = "pointer";
        _.button.innerHTML = _.button.dataset.init;
      }

      console.timeEnd("Ajax[" + timer + "] Loading Time");
    } else {
      console.log(
        "XMLHttpRequest State: %c" + readyState[httpRequest.readyState],
        "color: green"
      );
    }
  };

  // button loading start
  if (_.button != undefined) {
    _.button.disabled = true;
    _.button.style.cursor = "not-allowed";
    _.button.dataset.init = _.button.innerHTML;
    _.button.innerHTML = '<i class="fa-solid fa-spinner"></i>';
  }

  try {
    httpRequest.send(_.data ? _.data : "");
  } catch (error) {
    console.log(error);
  }
}

var readyState = {
  0: "uninitialized",
  1: "loading",
  2: "loaded",
  3: "interactive",
  4: "complete",
};

// date format
// 출처: https://stove99.tistory.com/46 [스토브 훌로구]
Date.prototype.format = function (f) {
  if (!this.valueOf()) return " ";

  var weekName = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
    switch ($1) {
      case "yyyy":
        return d.getFullYear();
      case "yy":
        return (d.getFullYear() % 1000).zf(2);
      case "MM":
        return (d.getMonth() + 1).zf(2);
      case "dd":
        return d.getDate().zf(2);
      case "E":
        return weekName[d.getDay()];
      case "HH":
        return d.getHours().zf(2);
      case "hh":
        return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case "mm":
        return d.getMinutes().zf(2);
      case "ss":
        return d.getSeconds().zf(2);
      case "a/p":
        return d.getHours() < 12 ? "오전" : "오후";
      default:
        return $1;
    }
  });
};
String.prototype.string = function (len) {
  var s = "",
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function (len) {
  return "0".string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
  return this.toString().zf(len);
};

// get kst or utc
function getCurTime(isUtc) {
  var now = new Date();
  var utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + (!isUtc ? 9 * 60 * 60 * 1000 : 0));
}
