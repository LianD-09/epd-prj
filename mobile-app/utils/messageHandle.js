export const isMessageForClient = (message, clientId) => {
    return message.includes(clientId);
}

export const isClientPublishing = (message, clientId) => {
    return message.startsWith(clientId);
} 

export const getMessageEpdId = (message) => {
    return message.split('@')[0];
}