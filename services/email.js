const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (to, token) => {
  const msg = {
    to,
    from: '1piway@gmail.com',
    subject: 'Verify your email',
    html: `<a href="${process.env.BASE_URL}/api/auth/verify/${token}">Click to verify your email</a>`,
  };

  await sgMail.send(msg);
};

module.exports = sendVerificationEmail;
