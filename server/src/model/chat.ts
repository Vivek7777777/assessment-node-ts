import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema(
    {
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
        },
        message: {
            type: String,
            required: true,
        }
    }
)

const Chat = mongoose.model('Chat', chatSchema)
export default Chat