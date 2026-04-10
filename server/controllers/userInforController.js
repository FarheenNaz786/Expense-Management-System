const ContactUsMessageModel = require("../models/contactUsMessageModel");
const sendMailThroughBrevo = require("../services/brevoEmailService");
const contactUsMessageSentSuccess = require("../utils/emailTemplates/contactUsMessageSent");
const { customAlphabet } = require("nanoid");
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const contactUsMessageController = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required...!" });
    }

    const user = await ContactUsMessageModel.findOne({ email });

    if (user) {
      user.name = name;
      user.email = email;
      user.message = message;
      await user.save();
    } else {
      // const nanoId = nanoid(10);
      const nanoid = customAlphabet(alphabet, 10); // 10 is the length of the Nano ID
      const nanoId = nanoid();
      console.log("contactUsUserId: ", nanoId);
      const newUser = new ContactUsMessageModel({
        contactUsUserId: nanoId,
        name,
        email,
        message,
      });
      await newUser.save();
    }
    const updatedUser = await ContactUsMessageModel.findOne({
      email,
    });

    // send an email for confirmation
    try {
      info = await sendMailThroughBrevo({
        to: updatedUser.email,
        subject: "Your contact us message sent successfully.",
        html: contactUsMessageSentSuccess(updatedUser, "no-reply@expense-management-system.com") // Your HTML generator
      });
    } catch (error) {
      console.error("Your contact us message mail failed to send...! Error:", error);
      return res.status(400).json({
        status: "failed",
        message: "Your contact us message mail failed to send...!",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Message sent successfully...!",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Internel Server error. Can't send message...!",
    });
  }
};

module.exports = { contactUsMessageController };
