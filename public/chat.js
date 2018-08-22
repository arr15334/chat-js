


$(function(){
  console.log('fasdf');
  var socket = io.connect('http://localhost:3000')
  socket.on('news', function(data) {
    console.log(data);
  })
  $('form').submit(function () {
    console.log('asdf');
    console.log(socket);
    socket.emit('new_message', {studentId: '15334', nickname: 'Sidd', msg: $('#m').val()});
    $('#m').val('');
    return false;
  });
  $('#quickReply').change(function () {
    socket.emit('new_message', {studentId: '15334', nickname: 'Sidd', msg: $('#quickReply').val()});
  })
  socket.on('new_message', function(msg){
    console.log(msg);
    // $('#messages').append($('<li>').text(msg.text));

    // TODO revisar si studentId = 15334
    // TODO ver como agregar clase a elemento dinamicamente
    const theChat = document.getElementById('theChat')
    const li = document.createElement('li');
    const strong = document.createElement('strong');
    const strongText = document.createTextNode(msg.nick);
    const liText = document.createTextNode('('+msg['student_id']+'): '+msg.text);

    if (msg['student_id'] == '15334') {
      li.className = 'myMessages'
    }
    /*
    <li><strong>nickname</strong>(studentId): text </li>
    */
    strong.appendChild(strongText);
    li.appendChild(strong);
    li.appendChild(liText);

    theChat.appendChild(li);
    // window.scrollTo(0, document.body.scrollHeight);
  });
})
