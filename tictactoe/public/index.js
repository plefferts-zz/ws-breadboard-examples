jQuery(function ($) {
  
  var port = 17071;
  var address = (window.location.href + '')
    .replace(/^(https?:\/\/([^@]*@)?([^:/]*))(:[0-9]+)/, '$1:' + port)
    .replace(/^http(s?)/, 'ws$1')
    .replace(/#.*$/, '');

  var connected = false
  var ws = new WebSocket(address)
  ws.onopen = function (e) {
    connected = true
  }
  ws.onerror = function (e) {
    connected = false
    $('#board').hide()
  }
  ws.onclose = function (e) {
    connected = false
    $('#board').hide()
  }
  ws.onmessage = function (e) {
    var data = JSON.parse(e.data);
    if (data.update) {
      var update = data.update
      tile(tileAt(update.x, update.y), update.value, false);
    }
    if (data.board) {
      var board = data.board;
      for (var y = 0; y < board.length; y ++) {
        for (var x = 0; x < board[y].length; x ++) {
          tile(tileAt(x, y), board[y][x]);
        }
      }
      $('#board').show();
    }
  }

  function tileAt(x, y) {
    return $('#board')
           .find('[data-y=' + y + ']')
           .find('[data-x=' + x + ']')
  }

  function tile(el, value, send) {
    el.find('a').removeClass('fa fa-5x fa-times fa-circle-o')
    if (value) {
      el.find('a').addClass('fa fa-5x ' + (value == 'x' ? 'fa-times' : 'fa-circle-o'))
    }
    el.data('tile', value)

    if (send) {
      var x = parseInt(el.attr('data-x'))
      var y = parseInt(el.parents('[data-y]').last().attr('data-y'))
      ws.send(JSON.stringify({_event:'set_tile', x: x, y: y, value : value}))
    }
  }
  
  $('#board').find('[data-x]').on('click', function (e) {
    e.preventDefault()
    var el    = $(this)
    var value = el.data('tile');
    value = !value ? 'x' : value == 'x' ? 'o' : '';
    
    tile($(this), value, true)
    
  })
  

  
})