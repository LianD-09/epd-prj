/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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

const Tab = createBottomTabNavigator();

const Home = ({ navigation }) => {
    
    return (
        //     <Tab.Navigator
        //   screenOptions={{
        //     tabBarShowLabel: false,
        //     tabBarHideOnKeyboard: true,
        //   }}>

        //   </Tab.Navigator>
        <ActivityIndicator size="large" color='green' style={styles.loading} />
    );
};

const styles = StyleSheet.create({
});

export default Home;