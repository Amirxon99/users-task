const nodemailer = require("nodemailer");

exports.sendVerificationMail = ({ to, password }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ibaydillayevamirullo@gmail.com",
      pass: "vpuklacmmfusiemq",
    },
  });
  const answer = `<h1> ${to} Siz uchun yangi Parol: <h2 style=color:red>${password}</h2></p>`;
  const options = {
    from: "ibaydillayevamirullo@gmail.com",
    to: to,
    subject: "",
    html: answer,
  };
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("email sent");
  });
};
