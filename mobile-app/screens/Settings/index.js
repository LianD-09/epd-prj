/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Keyboard,
} from 'react-native';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import { connect, disconnect, getAllConnectedEPD, sendMessageToTopic, subcribeTopic } from '../../services/mqttServices';
import { setStatus } from '../../redux/slice/mqttSlice';
import { BROADCAST_TOPIC } from "@env";

const Settings = ({ navigation }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const client = useSelector(state => state.mqtt).client;
    const status = useSelector(state => state.mqtt).status;
    const messages = useSelector(state => state.mqtt).messages;
    const [topic, setTopic] = useState('');

    useEffect(() => {
        console.log(messages);
    }, [messages])

    useEffect(() => {
        if (client?.isConnected()) {
            getAllConnectedEPD(client);
        }
    }, [status])

    const handleConnect = () => {
        setIsLoading(true);

        try {
            if (client?.isConnected()) {
                disconnect(client, {
                    onSuccess: () => dispatch(setStatus(false)),
                    onFailure: null
                });
                console.log('disconnected!');
            }
            else {
                connect(
                    client,
                    {
                        onSuccess: () => {
                            console.log('connected successfully!');
                            dispatch(setStatus(true));
                            subcribeTopic(client, BROADCAST_TOPIC, { qos: 0 });
                        },
                        onFailure: (err) => {
                            console.log('connected failed', err)
                        }
                    }
                )
            }
        }
        catch (e) {
            Alert.prompt(e);
            console.log(e);
        }
        finally {
            subcribeTopic(client, BROADCAST_TOPIC, { qos: 0 });
            getAllConnectedEPD(client);
            setIsLoading(false);
        }
    };

    const handleSubscribe = () => {
        Keyboard.dismiss();
        setIsLoading(true);
        try {
            subcribeTopic(client, topic, {
                onSuccess: () => console.log('subscribe to topic:', topic),
                qos: 0,
            })
        }
        catch (e) {
            console.log(e);
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        isLoading
            ? <ActivityIndicator size="large" color='green' style={styles.loading} />
            : <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 20, fontWeight: 800 }}>ID</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                        <View style={{ height: 16, aspectRatio: '1/1', backgroundColor: status ? '#5BBB5B' : '#E65C5C', borderRadius: 10 }} />
                        <Text style={{ fontSize: 16, color: status ? '#5BBB5B' : '#E65C5C' }}>{client?.clientId}</Text>
                    </View>
                    <TouchableOpacity
                        style={status ? styles.errButton : styles.button}
                        onPress={() => handleConnect()}
                    >
                        <Text style={{ color: 'white' }}>{status ? "Disconnect to Broker" : "Connect to Broker"}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Topic"
                            placeholderTextColor="#bebebe"
                            onChangeText={topic => setTopic(topic)}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleSubscribe()}>
                        <Text style={{ color: 'white' }}>Subscribe</Text>
                    </TouchableOpacity>
                </View>
            </View >
    );
};

const styles = StyleSheet.create({
    loading: {
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        paddingVertical: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 100,
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: 220,
        backgroundColor: '#3A5BB3',
        padding: 8,
        alignItems: 'center',
        marginTop: 25,
        borderRadius: 10,
    },
    errButton: {
        width: 220,
        backgroundColor: '#E65C5C',
        padding: 8,
        alignItems: 'center',
        marginTop: 25,
        borderRadius: 10,
    },
    textInput: {
        width: 220,
        fontSize: 15,
        padding: 8,
        color: '#484848',
    },
    inputView: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
});

export default Settings;