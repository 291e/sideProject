import { selectPosts, selectPost, insertPost, updatePost, deletePost, updateMember, deleteMember } from '../../db';

class postService{
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
    async postDelete(id){
        await deletePost(id);
    }
    async memberUpdate(member){
        await updateMember(member);
    }
    async memberDelete(id){
        await deleteMember(id);
    }
}
export default new postService;