import {MessageModel} from "../schema/message";

export interface MessageFactory {
    create(user_id: string, project_id: string, message: string, website_content: string, user_type: string) :Promise<MessageModel>
    get(user_id: string, project_id: string, message_id: string): Promise<MessageModel>
}