const db = require('../../db');
class memberService{
    async memberInfo(id){
        return await db.selectMember(id);
    }
    async memberUpdate(member){
        await db.updateMember(member);
    }
}
module.exports = new memberService;