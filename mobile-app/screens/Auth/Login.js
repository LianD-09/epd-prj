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
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import { StackActions } from '@react-navigation/native';
import icon from '../../assets/icon.png'

const Login = ({ navigation }) => {
  const [remember, setRemember] = useState(false);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitEvent = () => {
    setIsLoading(true);
    navigation.navigate('Home', { name: 'Home' });
  };

  return (
    isLoading
      ? <ActivityIndicator size="large" color='green' style={styles.loading} />
      : <View style={styles.container}>
        <Image
          style={styles.image}
          source={icon}
        />
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Phone or email"
            placeholderTextColor="#003f5c"
            onChangeText={email => setEmail(email)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={password => setPassword(password)}
          />
        </View>
        <View
          style={{
            margin: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <Checkbox
            status={remember ? 'checked' : 'unchecked'}
            color="black"
            onPress={() => {
              setRemember(!remember);
            }}
          />
          <Text style={{ marginTop: 8 }}>Remember me</Text>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => handleSubmitEvent()}>
          <Text style={{ color: 'white' }}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 20 }}>
          <Text
            style={styles.forgotButtonText}
            onPress={() => navigation.navigate('Home', {})}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation.navigate('Sign up', { name: 'Sign up' })}>
          <Text style={styles.forgotButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: '25%',
    resizeMode: 'contain',
  },
  inputView: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  textInput: {
    width: 220,
    fontSize: 15,
    padding: 10,
    color: '#6D1D3A',
  },
  loginButton: {
    width: 220,
    backgroundColor: '#3A5BB3',
    padding: 10,
    alignItems: 'center',
    marginTop: 25,
    borderRadius: 10,
  },
  forgotButtonText: {
    fontSize: 17,
    color: '#242A53',
  },
});

export default Login;