/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Keyboard,
    ScrollView,
} from 'react-native';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { sendMessageToTopic } from '../../services/mqttServices';
import SelectDropdown from 'react-native-select-dropdown';
import { getMessageEpdId } from '../../utils/messageHandle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ditheringGrayscale, getByteArray } from '../../services/imageService';

const Actions = ({ navigation }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [epdId, setEpdId] = useState('');
    const [image, setImage] = useState(null);
    const [type, setType] = useState('Text');
    const [text, setText] = useState('');
    const [encodeData, setEncodeData] = useState('');
    const mqtt = useSelector(state => state.mqtt);
    const client = mqtt.client;
    const epdList = useMemo(() => {
        const list = new Set(mqtt.messages?.map(it => getMessageEpdId(it.message)));

        return [...list];
    }, [mqtt.messages]);

    const handlePickImage = async () => {
        setIsLoading(true);
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [128, 296],
                base64: true,
            });

            if (!result.canceled) {
                setImage(result.assets[0]);
                const res = await getByteArray(result.assets[0].base64);
                setEncodeData(ditheringGrayscale(res.pixels));
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleSend = () => {
        Keyboard.dismiss();
        if (!client?.isConnected()) {
            Alert.alert('Connection', 'Connect to broker before taking action');
            navigation.navigate('Settings');
            return;
        }

        if (!image?.base64 && type === 'Image') {
            Alert.alert('Select image', 'You must select image first');
            return;
        }

        try {
            setIsLoading(true);
            sendMessageToTopic(
                client, 
                epdId + '@' + (type === 'Text' ? 'text' : 'image'), 
                type === 'Text' ? text : encodeData)
        }
        catch (e) {
            console.log(e);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        isLoading
            ? <ActivityIndicator size="large" color='green' style={styles.loading} />
            : <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                >
                    <View style={styles.header}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: 800 }}>EPD:</Text>
                            <View style={styles.inputView}>
                                <SelectDropdown
                                    data={epdList}
                                    buttonTextStyle={{ fontSize: 15 }}
                                    buttonStyle={styles.textSelect}
                                    defaultValue={epdId}
                                    onSelect={(item) => {
                                        setEpdId(item);
                                    }}
                                    renderDropdownIcon={() => <MaterialIcons name='arrow-drop-down' color={'#484848'} size={26} />}
                                />

                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: 800 }}>Type:</Text>
                            <View style={styles.inputView}>
                                <SelectDropdown
                                    data={['Text', 'Image']}
                                    defaultValue={type}
                                    buttonTextStyle={{ fontSize: 15 }}
                                    buttonStyle={styles.textSelect}
                                    onSelect={(item) => {
                                        setType(item);
                                    }}
                                    renderDropdownIcon={() => <MaterialIcons name='arrow-drop-down' color={'#484848'} size={26} />}
                                />

                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, display: 'flex', alignItems: 'center' }}>
                        {type === 'Text' ? <>
                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Text"
                                    placeholderTextColor="#bebebe"
                                    onChangeText={text => setText(text)}
                                    value={text}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.sendBtn}
                                onPress={() => handleSend()}>
                                <Text style={{ color: 'white' }}>Send</Text>
                            </TouchableOpacity>
                        </> : <>
                            <TouchableOpacity
                                style={styles.selectBtn}
                                onPress={() => handlePickImage()}>
                                <Text style={{ color: 'white' }}>Select Image</Text>
                            </TouchableOpacity>
                            {image && <Image source={{ uri: image.uri }} style={{ width: 128, height: 296, marginVertical: 10 }} />}

                            {image && <TouchableOpacity
                                style={styles.sendBtn}
                                onPress={() => handleSend()}>
                                <Text style={{ color: 'white' }}>Send image</Text>
                            </TouchableOpacity>}
                        </>
                        }
                    </View>
                </ScrollView>
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
        display: 'flex'
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 20
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    selectBtn: {
        width: 220,
        backgroundColor: '#694fad',
        padding: 8,
        alignItems: 'center',
        marginTop: 25,
        borderRadius: 10,
    },
    sendBtn: {
        width: 220,
        backgroundColor: '#3A5BB3',
        padding: 8,
        alignItems: 'center',
        marginTop: 25,
        borderRadius: 10,
    },
    textSelect: {
        width: 220,
        padding: 8,
        color: '#484848',
        backgroundColor: 'transparent'
    },
    textInput: {
        width: 220,
        fontSize: 15,
        padding: 8,
        color: '#484848',
    },
    inputView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
});

export default Actions;