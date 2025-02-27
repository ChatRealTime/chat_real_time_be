import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

//middleware để bảo vệ route (chỉ những người dùng đã đăng nhập mới có thể truy cập) -> check chứ kh trả về data cho client -> sử dụng bên phía BE
export const protectRoute = async (req, res, next) => {
  try {
    //check if token exists in cookies
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Lỗi xác thực - Chưa có token" });
    }

    //verify token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Lỗi xác thực - Token hết hiệu lực" });
    }

    const user = await UserModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    //gán user vào req để sử dụng ở các middleware hoặc các route handler phía sau có thể sử dụng
    req.user = user;

    next(); // chuyển tiếp cho những thằng route handler phía sau
  } catch (error) {
    console.log("Lỗi khi check đăng nhập hay chưa:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};
