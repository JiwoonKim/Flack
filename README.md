# Web50 Project 2 | Web50 프로젝트 2
> Practicing JavaScript to run single page application (to communicate with servers via Ajax and Socket IO).

> JavaScript를

## Project 2: Online Messaging Service
- For CS50 Web Programming with Python and JavaScript.
- Created an online messaging service similiar to Slack.
- Used Python and Flask as the server framerwork.
-
- channels and messages are stored as global variables instead of in databases so they will be initialized every time the server restarts.
- Used different methods of connection between client and server
- 1) generally, GET & POST requests and responses (defined in application.py).
-    + the javascript function for creating a new channel is not ajax (even though the action is defined in javascript, it is the same as creating a form in html; it submits a form via POST request and then the server sends a response to render the entire page. The function is merely defined in javascript because the form would have to encompass a large portion in the channel.html file if it were to be in the html file.)
- 2) Websockets for posting new messages because in need of persistent connection (일일이 매번 request 만드는 것 비효율적이기에) and broadcasting messages to all users.
- 3) Ajax for changing channels because websockets have problem with blockages and ajax is simplier for rest apis. 사실 그냥 post request하고 render entire page가 코드가 적을 수도..? 근데 연습삼아 ajax 사용해볼까...
-    -> ajax so that sidebar remains while the main content part of page만 바뀜


## 프로젝트 2: 온라인 메세지 서비스
- 하버드의 CS50 MOOC(edX)의 Web Programming with Python and JavaScript 수업의 프로젝트 2.
- Slack과 유사한 온라인 메세지 서비스를 개발.
- Python과 Flask를 서버 프레임워크로 사용함.


## what I learned | 무엇을 배웠는가
>
- learned that functions assigned to variables are not hoisted. That is, < const name = () => {} > must come before it is called.
- learned that it is important to create an ordered list of things to do in order to make the workflow efficient and not waste a lot of time contemplating on what I should do next.
  (create the ordered list based on the steps the user interface should flow: login -> access channel page/choose channel -> display messages accordingly -> write message -> post message via ajax -> and so)
- learned how to implement a queue(?) in Python
- need to have a better understanding of when to use ajax and when to use websockets
- addEventListener와 inline event(in js file) ex) onclick의 차이점 이해
- starting to think 어쩌면 bootstrap같은 템플렛보다 그냥 css를 적용하는 게 나을지도...(어차피 bootstrap위에서 수정을 하니..) grid와 flexbox도 있겠다...
- learned websockets are useful when you are broadcasting (not just full duplex communication) -> broadcasting 아닐시에는 사용비효율적인가?
- ajax랑 websocket 혼합해서 사용가능. websocket은 일일
- websockets and ajax both can partially modify the page (asynchronous 가능)
- websocket에서 data 보낸 거 json인 것인가? object? 뭐가 다르지ㅠㅜ
- learned css specificity. Since id has more specificity/priority over class, id in parent elements can override class in child elements. So best to use classes in general than ids. If necessary use !important.
- learned websocket(socketio)에서 반드시 emit을 해야할 필요x
- learned that submitting a form by defining its action in javascript does not mean it is ajax.
- -> get을 하든 post(data를 보냄)를 하든과는 상관없이, ajax과 post request 둘 다 가능.
- => just because I am sending something to the server by javascript code does not mean it is ajax! Make sure that first, parts of the page have changed instead of entire page, and second it has without without refreshing the page.
- need to 정리 restful web services의 정의
- flask socketio session is managed differently than flask session. (it forks the Flask user session at the time the client connects to the server over Socket.IO) so any change after socketio is connected is not reflected.