import cloudinary from "../lib/cloudinary.js";
import UserModel from "../models/user.model.js";

export const updateAvatar_api = async (req, res) => {
  try {
    const { avatar } = req.body;
    //check which user
    const userID = req.user._id;

    if (!avatar) {
      return res
        .status(422)
        .json({ field: "avatar", message: "Vui lòng chọn ảnh" });
    }

    const uploadCloudinary = await cloudinary.uploader.upload(avatar);

    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      {
        avatar: uploadCloudinary.secure_url,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(500)
        .json({ message: "Cập nhật ảnh đại diện thất bại" });
    }

    res.status(200).json({
      message: "Cập nhật ảnh đại diện thành công",
      data: {
        _id: updatedUser._id,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error("Lỗi khi update avatar:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};
