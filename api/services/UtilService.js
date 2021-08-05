const bcrypt = require('bcrypt');
const SALT_ROUND = 10;

module.exports = {

  async hashPassword(password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },
  async comparePassword(password, hash){
    return await bcrypt.compare(password,hash);

  }
};
