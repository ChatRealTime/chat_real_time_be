import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  //Tạo 1 JWT mới với userId và secret key
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  //Lưu JWT vào cookie cho phía client
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, //mili second
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return accessToken;
};

export const deleteToken = (res) => {
  res.cookie("accessToken", "", { maxAge: 0 });
};
