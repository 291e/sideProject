const db = require('../../db');

class postService {
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
    async postDelete(post_id, user_id){
        await db.deletePost(post_id, user_id);
    }

    async getComments(post_id){
        return await db.selectComments(post_id);
    }
    async commentCreate(comment, post_id, user_id){
        await db.insertComment(comment, post_id, user_id);
    }
    async commentUpdate(comment, comment_id, user_id){
        await db.updateComment(comment, comment_id, user_id);
    }
    async commentDelete(comment_id, user_id){
        await db.deleteComment(comment_id, user_id);
    }

    async getLikes(post_id){
        return await db.selectLikes(post_id);
    }
    async getLike(post_id, user_id){
        return await db.selectLike(post_id, user_id);
    }
    async likeCreate(post_id, user_id){
        await db.insertLike(post_id, user_id);
    }
    async likeDelete(like_id, user_id){
        await db.deleteLike(like_id, user_id);
    }
}
module.exports = new postService;