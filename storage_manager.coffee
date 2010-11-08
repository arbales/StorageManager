StorageManager = {
  get: (key) ->
    data = localStorage.getItem(key)
    if not data?
      false
    else
      value = JSON.parse data

  destroy: (key) ->
    value = StorageManager.get key
    localStorage.removeItem key
    value.id = undefined
    value

  all: ->
    for item in localStorage
      collection << StorageManager.get localStorage.key item
  
  set: (key, value) ->
    if not value? and not key.id?
      value = key
      key = StorageManager.uuid
    else if not value? and key.id?
      value = key
      key = value.id
    if typeof value == 'object'
      value.id = key
    localStorage.setItem key, JSON.stringify value
    return value
  
  uuid: ->
    hexDigits = '0123456789ABCDEF'
    s = for num in [0...32]
      hexDigits.substr Math.floor(Math.random() * 0x10), 1
    s[12] = 4
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1)
    s.join("")   
}