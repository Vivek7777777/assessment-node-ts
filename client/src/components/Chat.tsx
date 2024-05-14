import { IChat } from "../interface"

export const Chat = ({ chats }: { chats: IChat[] }) => {
    return (
        <>
            <div>
                {chats.map((chat, index) => (
                    <div key={index}>
                        {chat?.message}
                    </div>
                ))}
            </div>
        </>
    )
}