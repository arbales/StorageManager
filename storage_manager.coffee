CafeMapper = {
  active_engines: []
  listeners: {}
  uuid: ->
    hexDigits = '0123456789ABCDEF'
    s = for num in [0...32]
      hexDigits.substr Math.floor(Math.random() * 0x10), 1
    s[12] = 4
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1)
    s.join("")
  add_listener: (klass, event, callback) ->
    if not this.listeners[klass]
      this.listeners[klass] = {}
    if not this.listeners[klass][event]
      this.listeners[klass][event] = []
    this.listeners[klass][event].push callback
  fire: (klass, event, instance) ->
    if this.listeners[klass]? && this.listeners[klass][event]?
      for listener in this.listeners[klass][event]
        listener(instance)
    
  model: (klassname, data) ->
    klass = klassname
    class klass
      @get: (id) ->
        obj = CafeMapper.Base.get(id,false) || CafeMapper.Base.get(klassname+"#"+id,false)
        if obj == false
          false
        else
          new this(obj)
      @add_listener: (event, callback)->
        CafeMapper.add_listener(klassname, event, callback)
        true
      constructor: (values) ->
        this.meta = {}
        this.meta.klassname = klassname
        this.meta.properties = []
        this.defaults()
        for key,value of values
          this[key] = value
      defaults: ->
        for key, value of data
          if key != 'meta'
            this[key] = value
            this.meta.properties.push key
          else
            for mkey, mvalue of value
              this.meta[key] = value
      validate_key: ->
        if this.id? && (this.meta.properties.indexOf('id') < 0)
          this.meta.properties.push('id')
          if this.id.toString().substring(0, this.meta.klassname.length) != this.meta.klassname
            this.id = this.meta.klassname + "#" + this.id
      save: ->
        to_save = {}
        this.validate_key()
        for property in this.meta.properties
          to_save[property] = this[property]
        this.id = CafeMapper.Base.set(to_save).id
        CafeMapper.Base.fire(this.meta.klassname, 'save', this)
        this
}

CafeMapper.Base = {
    get: (key, extended) ->
      data = localStorage.getItem(key)
      if not data?
        false
      else
        data = JSON.parse data
        if (typeof data == 'object' && extended != false) then this.extended(data, this) else data

    destroy: (key) ->
      value = this.get key
      localStorage.removeItem key
      value.id = undefined
      value

    all: ->                   
  #    len = localStorage.length
      collection = for item in localStorage
        this.get localStorage.key item
      this.extended(collection, this)

    set: (key, value) ->    
      if not value? and not key.id?
        value = key
        key = CafeMapper.uuid()
      else if not value? and key.id?
        value = key
        key = value.id
      if typeof value == 'object'
        value.id = key

      localStorage.setItem key, JSON.stringify value
      if (typeof value == 'object') then this.extended(value, this) else value

    extended: (obj, context) ->
      if obj not instanceof Array
        obj.save = ->
          context.set(obj)
        obj.destroy = ->
          context.destroy(obj.id)
        obj.update = (source) ->
          for key, value of source
            obj[key] = value
          context.set(obj)
      else
        filter = (callback) ->
  	      collection = for item in obj
  	          if callback.call(item)
  	            item   

      obj
}
root = this
root.CafeMapper = CafeMapper