import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Loc from './Loc';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
      <Loc />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#600',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  texty: {
	color: '#FFF'
  }
});
/*
	        <Text style={styles.texty}>Open up App.js to start working on your app!</Text>
        <Text style={styles.texty}>Changes you make will automatically reload.</Text>
        <Text style={styles.texty}>Shake your phone to open the developer menu.</Text>
*/