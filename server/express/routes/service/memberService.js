import { 
    selectMember, updateMember, deleteMember,
    selectFollowers, selectFollowings, insertFollow, deleteFollow,
    isFollowing
} from '../../db';

class memberService{
    async getMember(id){
        return await selectMember(id);
    }
    async memberUpdate(member, auth_id){
        await updateMember(member, auth_id);
    }
    async memberDelete(auth_id){
        await deleteMember(auth_id);
    }
    
    async getFollowers(user_id){
        return await selectFollowers(user_id);
    }
    async getFollowings(user_id){
        return await selectFollowings(user_id);
    }
    async followingCreate(follower_id, following_id){
        await insertFollow(follower_id, following_id);
    }
    async followingDelete(follower_id, following_id){
        await deleteFollow(follower_id, following_id);
    }
    async isFollowing(following_id, follower_id){
        return isFollowing(following_id, follower_id);
    }
}
export default new memberService;