import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Call, CometChat, Conversation, Group, GroupType, User } from "@cometchat/chat-sdk-javascript";
import { CometChatUIKitConstants, CometChatUIKitLoginListener } from "@cometchat/chat-uikit-react";
import { AppContext } from "../../context/AppContext";
import { useMessageHandling } from "./CometChatHomeDebug";

function CometChatHomeWithDebug(props: { theme?: string }) {
    const [theme, setTheme] = useState<string>(props.theme || 'light');
    // ... [Keep all existing imports and component code]
    
    return (
        <div className="cometchat-root" data-theme={theme}>

            {/* Existing component JSX */}
        </div>
    );


    // Replace the existing message handling with debug version
    const { onMessageReceived } = useMessageHandling();

    const attachMessageReceivedListener = useCallback((messageListenerId: string) => {
        console.log("Attaching message listener with ID:", messageListenerId);
        console.log("Current user:", CometChatUIKitLoginListener.getLoggedInUser()?.getUid());
        const listener = new CometChat.MessageListener({


            onTextMessageReceived: async (textMessage: CometChat.TextMessage) => {
                await onMessageReceived(textMessage);
            },
            onMediaMessageReceived: async (mediaMessage: CometChat.MediaMessage) => {
                await onMessageReceived(mediaMessage);
            },
            onCustomMessageReceived: async (customMessage: CometChat.CustomMessage) => {
                await onMessageReceived(customMessage);
            }
        });
        console.log("Adding message listener...");
        CometChat.addMessageListener(messageListenerId, listener);
        console.log("Message listener successfully added");
        return () => {
            console.log("Removing message listener with ID:", messageListenerId);
            CometChat.removeMessageListener(messageListenerId);
        };

    }, [onMessageReceived]);

    useEffect(() => {
        console.log("Setting up message listener in useEffect");
        const messageListenerId = "message_listener_" + Date.now();
        console.log("Generated listener ID:", messageListenerId);
        const cleanupFn = attachMessageReceivedListener(messageListenerId);
        console.log("Message listener setup complete");
        return () => {
            console.log("Cleaning up message listener");
            if (cleanupFn) {
                cleanupFn();
            }
        };

    }, [attachMessageReceivedListener]);


    // ... [Keep rest of the component code unchanged]
}

export { CometChatHomeWithDebug };
