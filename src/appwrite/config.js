import { Client, Databases, ID, Query, Storage } from "appwrite";
import config from "../conf/conf";

class PostService {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // ===========================
    // POSTS
    // ===========================

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId,
}) {
    try {
        return await this.databases.createDocument(
            config.appwriteDataBaseId,
            config.appwriteCollectionId,
            slug || ID.unique(),
            {
                title,
                content,
                featuredImage,
                status,
                userId,
            }
        );
    } catch (error) {
        console.error("Create Post Error:", error);
        throw error;
    }
}

    async updatePost(
        documentId,
        {
            title,
            slug,
            content,
            featuredImage,
            status,
        }
    ) {
        try {
            return await this.databases.updateDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                documentId,
                {
                    title,
                    slug,
                    content,
                    featuredImage,
                    status,
                }
            );
        } catch (error) {
            console.error("Update Post Error:", error);
            throw error;
        }
    }

    async deletePost(documentId) {
        try {
            return await this.databases.deleteDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                documentId
            );
        } catch (error) {
            console.error("Delete Post Error:", error);
            throw error;
        }
    }

    async getPost(documentId) {
        try {
            return await this.databases.getDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                documentId
            );
        } catch (error) {
            console.error("Get Post Error:", error);
            return null;
        }
    }

 async getPosts({ status = "active", authorId, limit = 100 } = {}) {
    const queries = [
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
    ];

    if (status) {
        queries.push(Query.equal("status", status));
    }

    if (authorId) {
        queries.push(Query.equal("userId", authorId));
    }

    try {
        return await this.databases.listDocuments(
            config.appwriteDataBaseId,
            config.appwriteCollectionId,
            queries
        );
    } catch (error) {
        console.error("Get Posts Error:", error);
        throw error;
    }
}

    // ===========================
    // STORAGE
    // ===========================

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.error("Upload File Error:", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            return await this.bucket.deleteFile(
                config.appwriteBucketId,
                fileId
            );
        } catch (error) {
            console.error("Delete File Error:", error);
            return false;
        }
    }

  getFilePreview(fileId) {
    if (!fileId) return "";

    return this.bucket
        .getFileView(
            config.appwriteBucketId,
            fileId
        )
        .toString();
                  console.log("Preview URL:", url);
        } catch (error) {
            console.error("Preview Error:", error);
            return "";
        }
    }


const appwriteService = new PostService();

export default appwriteService;