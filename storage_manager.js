(function() {
  var StorageManager, root;
  var __hasProp = Object.prototype.hasOwnProperty;
  StorageManager = {
    listeners: {},
    add_listener: function(klass, event, callback) {
      if (!this.listeners[klass]) {
        this.listeners[klass] = {};
      }
      if (!this.listeners[klass][event]) {
        this.listeners[klass][event] = [];
      }
      return this.listeners[klass][event].push(callback);
    },
    fire: function(klass, event, instance) {
      var _i, _len, _ref, _result, listener;
      if ((typeof (_ref = this.listeners[klass]) !== "undefined" && _ref !== null) && (typeof (_ref = this.listeners[klass][event]) !== "undefined" && _ref !== null)) {
        _result = []; _ref = this.listeners[klass][event];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          listener = _ref[_i];
          _result.push(listener(instance));
        }
        return _result;
      }
    },
    model: function(klassname, data) {
      var klass;
      klass = klassname;
      klass = function(values) {
        var _ref, key, value;
        this.meta = {};
        this.meta.klassname = klassname;
        this.meta.properties = [];
        this.defaults();
        _ref = values;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          this[key] = value;
        }
        return this;
      };
      klass.get = function(id) {
        var obj;
        obj = StorageManager.get(id, false);
        return new this(obj);
      };
      klass.add_listener = function(event, callback) {
        StorageManager.add_listener(klassname, event, callback);
        return true;
      };
      klass.prototype.defaults = function() {
        var _ref, _ref2, _result, _result2, key, mkey, mvalue, value;
        _result = []; _ref = data;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          _result.push((function() {
            if (key !== 'meta') {
              this[key] = value;
              return this.meta.properties.push(key);
            } else {
              _result2 = []; _ref2 = value;
              for (mkey in _ref2) {
                if (!__hasProp.call(_ref2, mkey)) continue;
                mvalue = _ref2[mkey];
                _result2.push(this.meta[key] = value);
              }
              return _result2;
            }
          }).call(this));
        }
        return _result;
      };
      klass.prototype.save = function() {
        var _i, _len, _ref, property, to_save;
        to_save = {};
        _ref = this.meta.properties;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          property = _ref[_i];
          to_save[property] = this[property];
        }
        this.id = StorageManager.set(to_save).id;
        StorageManager.fire(this.meta.klassname, 'save', this);
        return this;
      };
      return klass;
    },
    get: function(key, extended) {
      var data;
      data = localStorage.getItem(key);
      if (!(typeof data !== "undefined" && data !== null)) {
        return false;
      } else {
        data = JSON.parse(data);
        return (typeof data === 'object' && extended !== false) ? this.extended(data, this) : data;
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
      var _i, _len, _ref, _result, collection, item;
      collection = (function() {
        _result = []; _ref = localStorage;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _result.push(StorageManager.get(localStorage.key(item)));
        }
        return _result;
      })();
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
