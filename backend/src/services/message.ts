import {MessageFactory} from "../factories/message";
import {Message, MessageModel, UserType} from "../schema/message";
import {BadRequestError, UnauthorizedError} from "../errors/errors";
import {Project} from "../schema/project";
import { User } from "../schema/user";

export class MessageService implements MessageFactory {
    create = async (user_id: string, project_id: string, message: string, website_content: string, user_type: string): Promise<MessageModel> => {
        const usertype: UserType = user_type as UserType;
        const user = await User.findOne({
            clerk_user_id: user_id
        })
        if (!user) {
            throw new BadRequestError("No user found")
        }
        const project = await Project.findById(project_id)
        if (!project) throw new BadRequestError("No project found");
        if (project.user_id !== user._id.toString()) {
            throw new UnauthorizedError("You dont have permission to create the message in this project")
        }
        const messageSchema = new Message({
            project_id: project_id,
            message: message,
            website_content: website_content,
            user_type: usertype,
        })
        await messageSchema.save();
        await Project.findByIdAndUpdate(project_id, {
            $push: {
               messages: messageSchema._id
            }
        })
        return messageSchema;
    }
    get = async (user_id: string, project_id: string, message_id: string): Promise<MessageModel> => {
        const user = await User.findOne({
            clerk_user_id: user_id
        })
        if (!user) {
            throw new BadRequestError("No user found")
        }
        const project = await Project.findById(project_id)
        if (!project) throw new BadRequestError("No project found");
        if (project.user_id !== user._id.toString()) {
            throw new UnauthorizedError("You dont have permission to see this project")
        }
        const message = await Message.findById(message_id)
        if (!message) {
            throw new BadRequestError("No message found with this project")
        }
        return message;
    }
}