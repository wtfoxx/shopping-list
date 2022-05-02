import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { initializeApp } from "firebase/app";
import { async } from '@firebase/util';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'



export default class Shopping extends React.Component {

  constructor() {
    super();
    this.state = {
      lists: [],
    };

    const firebaseConfig = {
      apiKey: "AIzaSyD1m5VHat6oJyvzG1FB7-ZwPZtSESAxQe0",
      authDomain: "shopping-1871f.firebaseapp.com",
      projectId: "shopping-1871f",
      storageBucket: "shopping-1871f.appspot.com",
      messagingSenderId: "850335850992",
    };

    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    };

    this.referenceShoppingLists = firebase
    .firestore()
    .collection('shoppinglists');

  };

  componentDidMount() {
    this.referenceShoppingLists = firebase
    .firestore()
    .collection('shoppinglists');

  
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: 'Hello there',
      });
      //create a reference to the active user's shopping lists
      this.referenceShoppinglistUser = firebase
      .firestore()
      .collection('shoppinglists')
      .where('uid', '==', this.state.uid);
    
      this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(this.onCollectionUpdate);
      });
  };
  
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  };

  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    //go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    this.setState({
      lists,
    });
  };

  addList() {
    this.referenceShoppingLists.add({
      name: 'TestList',
      items: ['eggs', 'pasta', 'veggies'],
      uid: this.state.uid,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.loggedInText}</Text>
        <Text style={styles.text}>Shopping Lists</Text>
        <FlatList
          data={this.state.lists}
          renderItem={({ item }) =>
          <Text style={styles.item}>{item.name}: {item.items}</Text>}
        />
        <Button onPress={() => this.addList()} title="Add List">Add List</Button>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  item: {
    fontSize: 20,
    color: 'blue',
  },

  text: {
    fontSize: 30,
  }
});
