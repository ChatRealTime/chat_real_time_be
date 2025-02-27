import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllUsers = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const filteredUsers = await UserModel.find({
      _id: { $ne: ownerId },
    }).select("-password"); // Lấy tất cả user ngoại trừ chính user đang đăng nhập

    res
      .status(200)
      .json({ message: "Lấy tất cả users thành công", data: filteredUsers });
  } catch (error) {
    console.log("Lỗi khi fetch tất cả user trong hệ thống", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getMessages = async (req, res) => {
  try {
    // Lấy id của user đang được chọn
    const { id: userToChatId } = req.params;
    //Lấy id của user đang đăng nhập -> của chính mình
    const myId = req.user._id;

    // Lấy tin nhắn giữa 2 người
    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }); // dùng or để lấy cả 2 trường hợp là mình gửi hoặc mình nhận

    res
      .status(200)
      .json({ message: "Lấy tin nhắn thành công", data: messages });
  } catch (error) {
    console.log("Lỗi khi fetch tin nhắn", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    // Lấy id của người nhận -> người mà mình muốn gửi tin nhắn
    const { id: receiverId } = req.params;
    // Lấy id của người gửi -> chính mình
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Nếu có ảnh thì lưu ảnh vào cloudinary theo dạng base 64
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //to do: real time

    res
      .status(201)
      .json({ message: "Gửi tin nhắn thành công", data: newMessage });
  } catch (error) {
    console.log("Lỗi khi gửi tin nhắn", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
