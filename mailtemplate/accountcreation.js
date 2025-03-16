const verifyAccountTemplate = (username, verificationLink) => {
  return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Verify Your Account</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #4CAF50;
				color: #ffffff;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<a href="https://yourcompany.com" class="logo">
				<img src="https://yourcompany.com/logo.png" alt="Your Company Logo">
			</a>
			<div class="message">Verify Your Account</div>
			<div class="body">
				<p>Dear ${username},</p>
				<p>Thank you for signing up with [Your Company]! To complete your registration, please verify your account by clicking the button below:</p>
				<a href="${verificationLink}" class="cta">Verify My Account</a>
				<p>If the button above doesn’t work, you can copy and paste the following link into your browser:</p>
				<p>${verificationLink}</p>
			</div>
			<div class="support">
				If you didn’t sign up for an account, please disregard this email. For further assistance, feel free to contact us at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>.
			</div>
		</div>
	</body>
	
	</html>`;
};

module.exports = verifyAccountTemplate;
