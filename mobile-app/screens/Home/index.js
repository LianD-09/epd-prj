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
    Image,
    Alert,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from '../Settings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Actions from '../Actions';
import { setClient, setState, updateMessages } from '../../redux/slice/mqttSlice';
import { MQTT_HOST, MQTT_PORT, BROADCAST_TOPIC } from '@env'
import { isClientPublishing, isMessageForClient } from '../../utils/messageHandle';

const Tab = createBottomTabNavigator();

const options = {
    host: MQTT_HOST,
    port: parseInt(MQTT_PORT),
    path: '/mqtt',
    id: Platform.OS + '_id_' + parseInt(Date.now() / 1000)
};

const Home = ({ navigation }) => {
    const mqttClient = new Paho.MQTT.Client(options.host, options.port, options.path, options.id);
    const dispatch = useDispatch();
    mqttClient.onMessageArrived = (message) => {
        const payload = message._getPayloadString();

        if (isMessageForClient(payload, mqttClient.clientId) && !isClientPublishing(payload, mqttClient.clientId)) {
            dispatch(updateMessages(message))
        }
    };

    useEffect(() => {
        dispatch(setClient({ client: mqttClient }))
    }, [])

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    backgroundColor: '#694fad',
                }
            }}
            initialRouteName='Settings'
            activeColor="#f0edf6"
            inactiveColor="#3e2465"
        >
            <Tab.Screen
                name='Settings'
                component={Settings}
                options={{
                    tabBarIcon: ({ focused }) => <MaterialIcons name='settings' color={focused ? '#f0edf6' : '#3e2465'} size={26} />
                }}
            />
            <Tab.Screen
                name='Actions'
                component={Actions}
                options={{
                    tabBarIcon: ({ focused }) => < MaterialIcons name='apps' color={focused ? '#f0edf6' : '#3e2465'} size={26} />
                }}
            />
        </Tab.Navigator >
    );
};

const styles = StyleSheet.create({
});

export default Home;