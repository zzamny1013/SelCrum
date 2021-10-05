import express from "express";
import passport from "passport";
import UserService from "../services/UserService.js";

const router = express.Router();

router.post("/sign_up", async function (req, res, next) {
  let body = req.body;

  console.log(body);

  const newUser = {
    user_id: body.user_id,
    pw: body.pw,
  };
  try {
    UserService.addUser(newUser);
    res.status(200);
    res.send("success sign_up");
  } catch (err) {
    console.error(err);
    next(err);
  }

  //res.redirect("/user/sign_up");
});

//login상태인지 토큰 검증(클라이언트에서 요청할 때 헤더에 Authorization: "Bearer " + {token값} 보내면 인증할 수 있음)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send("success");
  }
);

// 로그인 POST
router.post("/", (req, res, next) => {
  UserService.create(req, res, next);
});

router.get("/logout", function (req, res, next) {
  res.clearCookie("token");

  res.redirect("/");
});

export default router;
