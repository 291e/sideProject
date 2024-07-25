const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../../db');

class authService {
    async signup(username, email, password){

        if(!validator.isAlphanumeric(username) || !validator.isEmail(email) || !validator.isAlphanumeric(password)){
                return [400, 'Invalid String'];
        }
        else{
            try{
            await this.#registerMember(username,email,password);
                return [200, 'Register Success'];
            }
            catch(err){
                return [500, err.message];
            }
        }
    }

    async login(email, password){
        if(!validator.isEmail(email) || !validator.isAlphanumeric(password)){
            return [400, 'Invalid String'];
        }
        else{
            try{
                const hash = await db.authMember(email);
                const isMatch = await bcrypt.compare(password, hash.password);
            
                if(isMatch){
                //jwt token 발급
                    const token = await jwt.sign({ id: email }, process.env.JWT_SECRET, { expiresIn: '20m' });
                    const encryptedToken = crypto.Cipher;
                    return [200, token];
                }
                else{
                    return [401,'invalid password'];
                }
            }
            catch(err){
                return [500, err.message];
            }
        }
    }

    async #registerMember(username, id, password) {
        const saltRounds = 10;
    
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await db.begin();
            await db.insertMember(username,id,hashedPassword);
            await db.commit();
        } 
        catch (err) {
            await db.rollback();
            throw new Error('Duplicate id');
        }
    }
}

module.exports = new authService;