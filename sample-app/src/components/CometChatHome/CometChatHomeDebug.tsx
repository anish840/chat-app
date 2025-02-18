import { useCallback } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUIKitConstants, CometChatUIKitLoginListener } from "@cometchat/chat-uikit-react";


export const useMessageHandling = () => {
    const onMessageReceived = useCallback(
        async (message: CometChat.BaseMessage): Promise<void> => {
            console.log("Message received:", {
                id: message.getId(),
                type: message.getType(),
                sender: message.getSender()?.getName(),
                text: message instanceof CometChat.TextMessage ? message.getText() : "Non-text message",
                timestamp: new Date(message.getSentAt() * 1000).toISOString()
            });


            
            if (
                message.getSender().getUid() !== CometChatUIKitLoginListener.getLoggedInUser()?.getUid()
            ) {
                try {
                    console.log("Processing message from:", message.getSender().getUid());
                    
                    if (!message.getDeliveredAt()) {
                        console.log("Marking message as delivered");
                        CometChat.markAsDelivered(message);
                    }
                    
                    // Auto-reply to specific messages
                    if (message instanceof CometChat.TextMessage) {
                        const messageText = message.getText().toLowerCase().trim();
                        console.log("Text message content:", messageText);
                        
                        if (messageText === "!hello") {
                            console.log("Auto-reply triggered");
                        const receiverId = message.getSender().getUid();
                        console.log("Creating reply message to:", receiverId);
                        
                        const replyMessage = new CometChat.TextMessage(
                            receiverId,
                            "Hello, How are you!",
                            CometChatUIKitConstants.MessageReceiverType.user
                        );

                        
                        console.log("Attempting to send reply message...");
                        try {
                            await CometChat.sendMessage(replyMessage);
                            console.log("Reply message sent successfully to:", receiverId);
                        } catch (error) {
                            console.error("Failed to send reply message:", {
                                error,
                                receiverId,
                                timestamp: new Date().toISOString()
                            });
                        }

                            console.log("Reply message sent successfully");
                        }
                    }
                } catch (error) {
                    console.error("Error in message handling:", error);
                }
            }
        },
        []
    );

    return { onMessageReceived };
};
