const transporter = {
  sendMail: async () => {
    throw new Error(
      "Email transport disabled. No SMTP configuration is loaded."
    );
  },
};

module.exports = transporter;
