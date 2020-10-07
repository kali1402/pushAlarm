import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import axios from 'axios';

const PUSH_REGISTRATION_ENDPOINT = 'http://b95627dd84cf.ngrok.io/token';
const MESSAGE_ENPOINT = 'http://b95627dd84cf.ngrok.io/message';

export default function App() {

  const [state, setState] = useState({
    Notifications: null,
    messageText: ''
  });

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();

    return axios.post(PUSH_REGISTRATION_ENDPOINT, {
      token: {
        value: token
      },
      user: {
        username: 'kali',
        name: 'pushapp'
      }
    });
    const notificationSubscription = Notifications.addListener(handleNotification);
  }

  const handleNotification = (Notification) => {
    setState({ Notification });
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const handleChangeText = (text) => {
    setState({ messageText: text });
  }

  const sendMessage = async () => {
    axios.post(MESSAGE_ENPOINT, {
      message: state.messageText
    });
    setState({ messageText: '' });
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={state.messageText}
        onChange={handleChangeText}
        style={styles.textInput}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={sendMessage}>
        <Text style={styles.buttonText}>send</Text>
      </TouchableOpacity>
      {state.Notification ? renderNotification() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    width: 300,
    height: 50,
    backgroundColor: "blue",
  },
  button: {
    fontSize: 15,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  buttonText: {
    color: "gray",
  },
});
