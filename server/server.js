require("dotenv").config();
const db = require("./core/config/db");
const app = require("./app");
const { Op } = require("sequelize");

// models
const User=require("./modules/user/User");

const PORT = process.env.PORT || 5678;

db.authenticate()
  .then(async() => {
    console.log("DATABASE connected successfuly");
    db.sync({
      logging:false,
      // force:true
    });
    const superAdmin = await User.findAll({
      where: {
        role: { [Op.eq]: "SUPER_ADMIN" },
      },
    });
    if (superAdmin.length === 0) {
      const SuperAdmin = {
        firstName: "Amirxon",
        lastName: "Ibaydillayev",
        username: "myusername",
        password: "12345678",
        email: "abcd123@gmail.com",
        phoneNumber: "+998999999999",
        verificationCode: null,
        isVerified: true,
        role: "SUPER_ADMIN",
      };
      await User.create({ ...SuperAdmin });
    }
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server started on ${PORT} port`);
});
