/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Joi = require('joi');

module.exports = {
  
/**
   * `UserController.signup()`
   */
   signup: async function (req, res) {
    try {
      const schema = Joi.object().keys({
        username: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required()
      });


      // const schema = Joi.object({ 
      //   name: Joi.string() .min(6) .required(),
      //   email: Joi.string() .min(6) .required() .email(),
      //   password: Joi.string() .min(6) .required() 
      // });
        
        const validation = schema.validate(req.body);
      
        const {username, email, password} = validation.value;
        
       
        
      //const {email, password} = await Joi.validateAsync(req.allParams(), schema);
   
      const encryptedPassword = await UtilService.hashPassword(password);

      console.log(encryptedPassword);
      


      const results = await User.create({
        username,
        email,
        password: encryptedPassword
      });
      return res.ok(results);


    }
    catch (err) {
      if (err.name === 'ValidationError') {
        return res.badRequest({err});
      }
      return res.serverError(err);
    }
  },

  /**
   * `UserController.login()`
   */
  login: async function (req, res) {
    try {
      const schema = Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required()
      });
      
      
      const validation = schema.validate(req.body);
      
      const {email, password} = validation.value;

      //const {email, password} = await Joi.validate(req.allParams(), schema);


      const user = await User.findOne({email});
      if(!user){
        return res.notFound({err: 'user does not exist'});
      }
      const matchedPassword = await UtilService.comparePassword(password, user.password);
      if(!matchedPassword){
        return res.badRequest({err: 'unauthorized'});
      }
      const token = JWTService.issuer({uid: user.id}, '1 day');
      return res.ok({token});

    }
    catch (err) {
      if (err.name === 'ValidationError') {
        return res.badRequest({err});
      }
      return res.serverError(err);
    }
  }

};

