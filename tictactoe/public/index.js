jQuery(function ($) {
  
  var port = 17071;
  var address = (window.location.href + '')
    .replace(/^(https?:\/\/([^@]*@)?([^:/]*))(:[0-9]+)/, '$1:' + port)
    .replace(/^http(s?)/, 'ws$1');

  var connected = false
  var ws = new WebSocket(address)
  ws.onopen = function (e) {
    connected = true
  }
  ws.onerror = function (e) {
    connected = false
  }
  ws.onclose = function (e) {
    connected = false
  }
  ws.onmessage = function (e) {
    console.log(e.data)
  }

  function tile(el, value) {
    el.find('a').removeClass('fa fa-5x fa-times fa-circle-o')
    if (value) {
      el.find('a').addClass('fa fa-5x ' + (value == 'x' ? 'fa-times' : 'fa-circle-o'))
    }
    el.data('tile', value)
    ws.send(JSON.stringify({_event:'set_tile', x: 0, y: 0, value : value}))
  }
  
  $('#board').find('[data-x]').on('click', function (e) {
    e.preventDefault()
    var el    = $(this)
    var value = el.data('tile');
    value = !value ? 'x' : value == 'x' ? 'o' : '';
    
    tile($(this), value)
    
  })
  

  
})