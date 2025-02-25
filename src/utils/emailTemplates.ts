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


export const newUserWelcomeTemplate = (name: string, email: string, password: string, role: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Meta CMS</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 30px; max-width: 600px; margin: 0 auto; text-align: center;">
    
    <h2 style="color: #2a9d8f;">🎉 Welcome to Meta CMS!</h2>
    
    <p style="font-size: 16px; color: #333333;">Hello <strong>${name}</strong>,</p>
    
    <p style="font-size: 16px; color: #333333;">
      You have been successfully registered in <strong>Meta CMS</strong>. Below are your login credentials:
    </p>
    
    <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="font-size: 16px; color: #333333;"><strong>Email:</strong> ${email}</p>
      <p style="font-size: 16px; color: #333333;"><strong>Password:</strong> ${password}</p>
      <p style="font-size: 16px; color: #2a9d8f; text-transform: capitalize;"><strong>Assigned Role:</strong> ${role}</p>
    </div>

    <p style="font-size: 16px; color: #333333;">
      For security reasons, we highly recommend changing your password after your first login.
    </p>

    <p style="font-size: 16px; color: #d9534f; font-weight: bold;">
      ⚠ Important: Do not share your password with anyone. Always keep your account secure.
    </p>

    <a href="https://metacms.us/login" 
       style="display: inline-block; background-color: #2a9d8f; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 16px; font-weight: bold; margin-top: 20px;">
      Login to Meta CMS
    </a>

    <p style="font-size: 14px; color: #777777; margin-top: 20px;">
      If you have any questions, feel free to reach out to our support team.
    </p>

    <p style="font-size: 14px; color: #777777; margin-top: 10px;">
      Thank you for joining us!<br> 
      <strong>Meta CMS Team</strong>
    </p>
  </div>
</body>
</html>
`;
