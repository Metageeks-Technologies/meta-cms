export const resetPasswordOtpTemplate = (name: string, otp: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password OTP</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 30px; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333333;">Password Reset OTP</h2>
    <p style="font-size: 16px; color: #333333;">Hello ${name},</p>
    <p style="font-size: 16px; color: #333333;">
      We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your password.
    </p>
    <p style="font-size: 20px; font-weight: bold; color: #2a9d8f; text-align: center; margin: 20px 0;">
      ${otp}
    </p>
    <p style="font-size: 16px; color: #333333;">
      This OTP is valid for 10 minutes from the time you received this email.
    </p>
    <p style="font-size: 16px; color: #333333;">
      If you didn't request this, please ignore this email.
    </p>
    <p style="font-size: 14px; color: #777777;">Thank you,</p>
    <p style="font-size: 14px; color: #777777;">Meta - CMS</p>
  </div>
</body>
</html>
`;


export const emailVerificationOtpTemplate = (otp: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification OTP</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 30px; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333333;">Email Verification OTP</h2>
    <p style="font-size: 16px; color: #333333;">Hello,</p>
    <p style="font-size: 16px; color: #333333;">
      Thank you for signing up with Meta - CMS! To complete your registration, please use the following One-Time Password (OTP) to verify your email address.
    </p>
    <p style="font-size: 20px; font-weight: bold; color: #2a9d8f; text-align: center; margin: 20px 0;">
      ${otp}
    </p>
    <p style="font-size: 16px; color: #333333;">
      This OTP is valid for 10 minutes from the time you received this email.
    </p>
    <p style="font-size: 16px; color: #333333;">
      If you didn't sign up for this account, please ignore this email.
    </p>
    <p style="font-size: 14px; color: #777777;">Thank you,</p>
    <p style="font-size: 14px; color: #777777;">Meta - CMS</p>
  </div>
</body>
</html>
`;

