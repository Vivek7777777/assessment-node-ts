import { IChat } from "../interface";
import Chat from '../model/chat'

export default async function newChat(data: IChat){
    try{
        const chat = new Chat(data)
        const savedChat = await chat.save()
        console.log(savedChat);
    }
    catch{(err: any)=>{
        console.log('Error in inserting new chat ', err);
    }}
}