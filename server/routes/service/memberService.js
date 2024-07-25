const db = require('../../db');
class memberService{
    async memberInfo(id){
        return await db.selectMember(id);
    }
}
module.exports = new memberService;