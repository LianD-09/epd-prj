import { MQTT_USERNAME, MQTT_PASSWORD } from '@env';

export const connect = (client, payload) => {
    client.connect({
        userName: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        useSSL: false,
        reconnect: true,
        timeout: 10,
        onSuccess: payload.onSuccess,
        onFailure: payload.onFailure
    })
}

export const disconnect = (client, { onSuccess, onFailure }) => {
    try {
        client.disconnect();
        onSuccess();
    }
    catch (e) {
        onFailure();
    }
}

export const subcribeTopic = (client, topic, payload) => {
    if (!client?.isConnected()) {
        return;
    }

    client.subscribe(
        topic,
        {
            ...payload
        }
    )
}

export const unsubcribeTopic = (client, topic, payload) => {
    if (!client?.isConnected()) {
        return;
    }

    client.unsubscribe(
        topic,
        {
            ...payload
        }
    )
}

export const sendMessageToTopic = (client, topic, message = '') => {
    if (!client?.isConnected()) {
        return;
    }

    const mes = new Paho.MQTT.Message(message);
    mes.destinationName = topic;
    client.send(mes);
}

export const getAllConnectedEPD = (client) => {
    if (!client?.isConnected()) {
        return;
    }

    const mes = new Paho.MQTT.Message(`${client.clientId}@list`);
    mes.destinationName = 'epd';
    client.send(mes);
}

