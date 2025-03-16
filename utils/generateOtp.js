exports.generateotp = () => {
  return Math.floor(Math.random() * 900000 + 100000);
};
