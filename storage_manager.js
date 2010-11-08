(function() {
  var StorageManager;
  StorageManager = {
    get: function(key) {
      var data, value;
      data = localStorage.getItem(key);
      return !(typeof data !== "undefined" && data !== null) ? false : (value = JSON.parse(data));
    },
    destroy: function(key) {
      var value;
      value = StorageManager.get(key);
      localStorage.removeItem(key);
      value.id = undefined;
      return value;
    },
    all: function() {
      var _i, _len, _ref, _result, item;
      _result = []; _ref = localStorage;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _result.push(collection << StorageManager.get(localStorage.key(item)));
      }
      return _result;
    },
    set: function(key, value) {
      var _ref;
      if (!(typeof value !== "undefined" && value !== null) && !(typeof (_ref = key.id) !== "undefined" && _ref !== null)) {
        value = key;
        key = StorageManager.uuid;
      } else if (!(typeof value !== "undefined" && value !== null) && (typeof (_ref = key.id) !== "undefined" && _ref !== null)) {
        value = key;
        key = value.id;
      }
      if (typeof value === 'object') {
        value.id = key;
      }
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    },
    uuid: function() {
      var _result, hexDigits, num, s;
      hexDigits = '0123456789ABCDEF';
      s = (function() {
        _result = [];
        for (num = 0; num < 32; num++) {
          _result.push(hexDigits.substr(Math.floor(Math.random() * 0x10), 1));
        }
        return _result;
      })();
      s[12] = 4;
      s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);
      return s.join("");
    }
  };
}).call(this);
