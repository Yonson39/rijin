import Stomp from 'Stomp'
const stompurl = 'ws://121.40.142.221:15674/ws'
export var StompClient = null

export const StompLib = {
  onConnect (x) {
    StompClient.subscribe('/queue/testM', function (d) {
      // print_first(d.body)
      console.log(d)
      console.log(d.body)
      console.log('Stompconnect')
      // StompClient.send('/queue/testM', {priority: 9}, 'Hello, STOMP')
    }, { 'auto_delete': false, 'id': '1234', 'durable': true })
  },
  // Declare on_error
  onError () {
    console.log('error')
  },
  // stompInit
  stompInit () {
    if (StompClient !== null) {
    } else {
      StompClient = Stomp.client(stompurl)
    }
  },
  stompConnect (userName, password) {
    StompClient.connect(userName, password, function (x) {
      StompClient.subscribe('/queue/testM', function (d) {
        // print_first(d.body)
        console.log(d)
        console.log(d.body)
        console.log('Stompconnect')
        // StompClient.send('/queue/testM', {priority: 9}, 'Hello, STOMP')
      }, { 'auto_delete': false, 'id': '1234', 'durable': true })
    }, function () {
      console.log('error')
    }, '/')
  }
}
