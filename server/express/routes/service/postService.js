const db = require('../../db');

class postService{
    async getPosts(){
        return await db.selectPosts();
    }
    async getPost(id){
        return await db.selectPost(id);
    }
    async postCreate(post){
        await db.insertPost(post);
    }
    async postUpdate(post){
        await db.updatePost(post);
    }
    async postDelete(id){
        await db.deletePost(id);
    }
    async memberUpdate(member){
        await db.updateMember(member);
    }
    async memberDelete(id){
        await db.deleteMember(id);
    }
}
module.exports = new postService;