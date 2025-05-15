const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const users = [
  {
    user_id: "test",
    user_password: "1234",
    user_name: "테스트 유저",
    user_info: "테스트 유저입니다",
  },
];

const app = express();

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5501",
      "http://localhost:5501",
    ],
    methods: ["OPTIONS", "POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const secretKey = "ozcodingschool";

// 클라이언트에서 post 요청을 받은 경우
app.post("/", (req, res) => {
  const { userId, userPassword } = req.body;
  const userInfo = users.find(
    (el) => el.user_id === userId && el.user_password === userPassword
  );
  // 유저정보가 없는 경우
  if (!userInfo) {
    return res.status(401).send("로그인 실패");
  }
  const accessToken = jwt.sign({ user_id: userInfo.user_id }, secretKey, {
    expiresIn: 1000 * 60 * 60,
  });
  return res.send(accessToken);
});

// 클라이언트에서 get 요청을 받은 경우
app.get("/", (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  const payload = jwt.verify(accessToken, secretKey);
  const userInfo = users.find((el) => el.user_id === payload.user_id);
  return res.send(userInfo);
});

app.listen(3000, () => console.log("서버 실행!"));
