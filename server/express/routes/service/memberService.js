const db = require('../../db');
class memberService{
    async memberInfo(id){
        return await db.selectMember(id);
    }
    async memberUpdate(member){
        await db.updateMember(member);
    }
    async memberDelete(id){
        await db.deleteMember(id);
    }
}
module.exports = new memberService;