import {
    selectPosts, selectPost, insertPost, updatePost, deletePost,
    selectComments, insertComment, updateComment, deleteComment,
    selectLikes, selectLike, insertLike, deleteLike
} from '../../db';

class postService {
    async getPosts(){
        return await selectPosts();
    }
    async getPost(id){
        return await selectPost(id);
    }
    async postCreate(post){
        await insertPost(post);
    }
    async postUpdate(post){
        await updatePost(post);
    }
    async postDelete(post_id, user_id){
        await deletePost(post_id, user_id);
    }

    async getComments(post_id){
        return await selectComments(post_id);
    }
    async commentCreate(comment, post_id, user_id){
        await insertComment(comment, post_id, user_id);
    }
    async commentUpdate(comment, comment_id, user_id){
        await updateComment(comment, comment_id, user_id);
    }
    async commentDelete(comment_id, user_id){
        await deleteComment(comment_id, user_id);
    }

    async getLikes(post_id){
        return await selectLikes(post_id);
    }
    async getLike(post_id, user_id){
        return await selectLike(post_id, user_id);
    }
    async likeCreate(post_id, user_id){
        await insertLike(post_id, user_id);
    }
    async likeDelete(like_id, user_id){
        await deleteLike(like_id, user_id);
    }
}
export default new postService;