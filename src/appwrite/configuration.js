import { conf } from "../configEnv/config-env";
import { Client, Account, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client()
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }
    
    async createPost({ title, slug, content, image, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDBId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    slug,
                    content,
                    image,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.log("Appwrite service :: Create Post Error", error);
        }
    }

    async updatePost(slug, { title, content, image, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDBId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    image,
                    content,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite service :: Update Post Error", error);

        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDBId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: Delete Post Error", error);
            return false
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDBId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: Get Post Error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDBId,
                conf.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.log("Appwrite service :: Get Posts Error", error);
            return false
        }
    }

    // File Upload Services
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: Uploadfile Error", error);
            return false
        }
    }
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: Deletefile Error", error);
            return false
        }
    }

    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}

const service = new Service()
export default service