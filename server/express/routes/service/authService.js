import { isAlphanumeric, isEmail } from 'validator';
import { compare, hash as _hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { authMember, begin, insertMember, commit, rollback } from '../../db';

class authService {
    async signup(username, email, password){

        if(!isAlphanumeric(username) || !isEmail(email) || !isAlphanumeric(password)){
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
        if(!isEmail(email) || !isAlphanumeric(password)){
            return [400, 'Invalid String'];
        }
        else{
            try{
                const hash = await authMember(email);
                const isMatch = await compare(password, hash.password);
            
                if(isMatch){
                //jwt token 발급
                    const token = await sign({ id: email }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '20m' });
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
            const hashedPassword = await _hash(password, saltRounds);
            await begin();
            await insertMember(username,id,hashedPassword);
            await commit();
        } 
        catch (err) {
            await rollback();
            throw new Error('Duplicate id');
        }
    }
}

export default new authService;