# Web50 Project 2 | Web50 프로젝트 2
> Practicing JavaScript to run single page application (to communicate with servers via Ajax and Socket IO).

> JavaScript를

## Project 2: Online Messaging Service
- For CS50 Web Programming with Python and JavaScript.
- Created an online messaging service similiar to Slack.
- Used Python and Flask as the server framerwork.
-
- channels and messages are stored as global variables instead of in databases so they will be initialized every time the server restarts.

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
- 어쩌면 bootstrap같은 템플렛보다 그냥 css를 적용하는 게 나을지도...(어차피 bootstrap위에서 수정을 하니..) grid와 flexbox도 있겠다...
- learned websockets are useful when you are broadcasting (not just full duplex communication)
- learned !important in css (?)