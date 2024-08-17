const db = require('../../db');

class memberService{
    async getMember(id){
        return await db.selectMember(id);
    }
    async memberUpdate(member, auth_id){
        await db.updateMember(member, auth_id);
    }
    async memberDelete(auth_id){
        await db.deleteMember(auth_id);
    }
    
    async getFollowers(user_id){
        return await db.selectFollowers(user_id);
    }
    async getFollowings(user_id){
        return await db.selectFollowings(user_id);
    }
    async followingCreate(follower_id, following_id){
        await db.insertFollow(follower_id, following_id);
    }
    async followingDelete(follower_id, following_id){
        await db.deleteFollow(follower_id, following_id);
    }
    async isFollowing(following_id, follower_id){
        return db.isFollowing(following_id, follower_id);
    }
}
module.exports = new memberService;