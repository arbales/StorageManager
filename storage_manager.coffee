StorageManager = {
  get: (key) ->
    data = localStorage.getItem(key)
    if not data?
      false
    else
      data = JSON.parse data
      if (typeof data == 'object') then this.extended(data, this) else data

  destroy: (key) ->
    value = StorageManager.get key
    localStorage.removeItem key
    value.id = undefined
    value

  all: ->                   
    len = localStorage.length
    for i=0; i < len; len++;
      console.log i
      StorageManager.get localStorage.key item
    this.extended(collection, this)
    
  set: (key, value) ->    
    if not value? and not key.id?
      value = key
      key = StorageManager.uuid()
    else if not value? and key.id?
      value = key
      key = value.id
    if typeof value == 'object'
      value.id = key
        
    localStorage.setItem key, JSON.stringify value
    if (typeof value == 'object') then this.extended(value, this) else value
    
  
  uuid: ->
    hexDigits = '0123456789ABCDEF'
    s = for num in [0...32]
      hexDigits.substr Math.floor(Math.random() * 0x10), 1
    s[12] = 4
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1)
    s.join("")   
  
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

root = exports ? this
root.StorageManager = StorageManager