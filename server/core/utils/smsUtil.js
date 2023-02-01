const AppError = require("../utils/appError");
const catchAsync = require("./catchAsync");

exports.sendVerificationSMS = catchAsync(async ({ to, vercode, next }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  return (message = client.messages
    .create({ from: "+16572864768", body: `Your password: ${vercode}`, to: `+${to}` })
    .then((message) => console.log('')));
});
