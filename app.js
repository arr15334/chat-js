var express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server)
var axios = require('axios')
var qs = require('qs')
let totalMessages = 0

server.listen('3000')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})



io.on('connection', (socket) => {
  // console.log('User connected')
  // socket.username = 'Anonymous'
  // socket.on('change_username', (data) => {
  //   socket.username = data.username
  // })
  // console.log(socket);
  socket.on('new_message', (data) => {
    const msg = data.msg
    const nick = data.nickname
    const studentId = data.studentId
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    axios.post('http://34.210.35.174:7000',
      qs.stringify({
        'student_id': studentId,
        'nick': nick,
        'text': msg
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
  )
    .then(() => {
      return null
    })
    .catch(err => {
      console.log(err);
    })
  })
})

function checkChat () {
  return axios.get('http://34.210.35.174:7000')
    .then(response => {
      return response.data
    })
    // .then((response) => response.json())
    .then(response => {
      let chatHistory = [];
			for (const resp of response) {
				chatHistory.push({
					studentId: resp['student_id'],
					text: resp['text'],
					nickname: resp.nick
				})
			}
			return chatHistory;
    })
    .then((chatHistory) => {
			for (let i = 0; i < chatHistory.length; i++) {
				if ((i+ 1) > totalMessages) {
          // console.log(chatHistory[i])
          const chatObj = chatHistory[i]
          console.log(chatObj);
          io.emit('new_message', {
            'student_id': chatObj.studentId,
            text: chatObj.text,
            nick: chatObj.nickname
          })
				}
			}
			return chatHistory.length
		})
		.then((chatSize) => {
			totalMessages = chatSize
		})
}

// checkChat()
setInterval(checkChat, 7000)
