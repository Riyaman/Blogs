import { Account, Client, ID } from "appwrite";
import config from "../conf/conf.js";

const client = new Client().setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
const account = new Account(client);

class AuthService {
    async createAccount({ email, password, name }) {
        try {
            await account.create(ID.unique(), email, password, name.trim());
            return await this.login({ email, password });
        } catch (error) {
            throw new Error(error?.message || "We couldn't create your account.");
        }
    }

    async login({ email, password }) {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw new Error(error?.message || "Your email or password is incorrect.");
        }
    }

    async getCurrentUser() {
        try {
            return await account.get();
        } catch {
            return null;
        }
    }

    async logout() {
        try {
            await account.deleteSession("current");
        } catch (error) {
            throw new Error(error?.message || "Unable to sign out right now.");
        }
    }
}

export default new AuthService();
