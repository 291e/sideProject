import { selectMember, updateMember, deleteMember } from '../../db';

class memberService{
    async memberInfo(id){
        return await selectMember(id);
    }
    async memberUpdate(member){
        await updateMember(member);
    }
    async memberDelete(id){
        await deleteMember(id);
    }
}
export default new memberService;