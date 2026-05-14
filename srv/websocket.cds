@protocol: 'websocket'
service ChatService {
  function message(text: String) returns String;
  event received {
    text: String;
  }
}