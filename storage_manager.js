(function() {
  var StorageManager, root;
  var __hasProp = Object.prototype.hasOwnProperty;
  StorageManager = {
    get: function(key) {
      var data;
      data = localStorage.getItem(key);
      if (!(typeof data !== "undefined" && data !== null)) {
        return false;
      } else {
        data = JSON.parse(data);
        return (typeof data === 'object') ? this.extended(data, this) : data;
      }
    },
    destroy: function(key) {
      var value;
      value = StorageManager.get(key);
      localStorage.removeItem(key);
      value.id = undefined;
      return value;
    },
    all: function() {
      var _i, _len, _ref, item;
      _ref = localStorage;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        console.log(item);
        StorageManager.get(localStorage.key(item));
      }
      return this.extended(collection, this);
    },
    set: function(key, value) {
      var _ref;
      if (!(typeof value !== "undefined" && value !== null) && !(typeof (_ref = key.id) !== "undefined" && _ref !== null)) {
        value = key;
        key = StorageManager.uuid();
      } else if (!(typeof value !== "undefined" && value !== null) && (typeof (_ref = key.id) !== "undefined" && _ref !== null)) {
        value = key;
        key = value.id;
      }
      if (typeof value === 'object') {
        value.id = key;
      }
      localStorage.setItem(key, JSON.stringify(value));
      return (typeof value === 'object') ? this.extended(value, this) : value;
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
    },
    extended: function(obj, context) {
      var filter;
      if (!(obj instanceof Array)) {
        obj.save = function() {
          return context.set(obj);
        };
        obj.destroy = function() {
          return context.destroy(obj.id);
        };
        obj.update = function(source) {
          var _ref, key, value;
          _ref = source;
          for (key in _ref) {
            if (!__hasProp.call(_ref, key)) continue;
            value = _ref[key];
            obj[key] = value;
          }
          return context.set(obj);
        };
      } else {
        filter = function(callback) {
          var _i, _len, _ref, _result, collection, item;
          return (collection = (function() {
            _result = []; _ref = obj;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              _result.push(callback.call(item) ? item : null);
            }
            return _result;
          })());
        };
      }
      return obj;
    }
  };
  root = (typeof exports !== "undefined" && exports !== null) ? exports : this;
  root.StorageManager = StorageManager;
}).call(this);
