//API functions for authentication

import { deleteToken, generateToken } from "../lib/utils.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup_api = async (req, res) => {
  //get data from request body
  const { email, fullname, password } = req.body;
  try {
    if (!email || !fullname || !password) {
      return res.status(422).json({ message: "Vui lòng điền tất cả ô trống" });
    }

    if (password.length < 6) {
      return res
        .status(422)
        .json({ field: "password", message: "Mật khẩu phải ít nhất 6 ký tự" });
    }

    const userEmail = await UserModel.findOne({ email });
    if (userEmail) {
      return res.status(422).json({ message: "Email đã tồn tại" });
    }

    const salt = await bcrypt.genSalt(10); //hàm giúp tạo ra 1 chuỗi ngẫu nhiên trước khi băm giúp 2 ng dùng đặt cùng 1 mật khẩu nhưng sẽ được băm thành 2 chuỗi khác nhau

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      email,
      fullname,
      password: hashedPassword,
    });

    if (newUser) {
      //generate  jwt token
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        message: "Đăng ký thành công",
        data: {
          _id: newUser._id,
          email: newUser.email,
          fullname: newUser.fullname,
          avatar: newUser.avatar,
        },
      });
    } else {
      return res.status(500).json({ message: "Đăng ký thất bại" });
    }
  } catch (error) {
    console.error("Lỗi khi signup:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

export const login_api = async (req, res) => {
  //get data from client request
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ message: "Vui lòng điền tất cả ô trống" });
    }

    const userEmail = await UserModel.findOne({ email });
    if (!userEmail) {
      return res
        .status(422)
        .json({ field: "email", message: "Email hoặc mật khẩu không đúng" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userEmail.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(422)
        .json({ field: "password", message: "Email hoặc mật khẩu không đúng" });
    }

    if (userEmail && isPasswordCorrect) {
      generateToken(userEmail._id, res);
      return res.status(200).json({
        message: "Đăng nhập thành công",
        data: {
          _id: userEmail._id,
          email: userEmail.email,
          fullname: userEmail.fullname,
          avatar: userEmail.avatar,
        },
      });
    }
  } catch (error) {
    console.error("Lỗi khi login:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

export const logout_api = async (req, res) => {
  try {
    deleteToken(res);
    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Lỗi khi logout:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

//API này giúp client có thể kiểm tra xem đã đăng nhập hay chưa. Nếu đã đăng nhập thì trả về thông tin user
export const checkAuth_api = async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Check đăng nhập thành công", data: req.user });
  } catch (error) {
    console.log("Lỗi khi check auth:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};
