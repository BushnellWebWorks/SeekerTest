import React from 'react';
import Seeker from './Seeker';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';


class SeekerTest extends Seeker {
	getTowardAway() {
		if ( this.state.towardAway === null ) { return null; }
		switch ( this.state.towardAway ) {
			case -1:
				return 'colder';
			break;
			case 1:
				return 'warmer';
			break;
			case 0:
				return 'no change';
			break;	
		}
	}	
	
	render() {
		
		return (
			<View style={styles.container}>
				<Text style={styles.paragraph}>{this.getTowardAway()}</Text>
				<Text style={styles.paragraph}>{Math.round(this.state.current.lat*10e6)/10e6},{Math.round(10e6*this.state.current.lon)/10e6}</Text>
				<Text style={styles.paragraph}>{Math.round(this.state.target.lat*10e6)/10e6},{Math.round(this.state.target.lon*10e6)/10e6}</Text>
				<Text style={styles.paragraph}>about {Math.round(this.state.target.d / 5) * 5} feet</Text>
				<Text style={styles.paragraph}>{this.state.target.headingText}: {Math.round(10*this.state.target.heading)/10}</Text>
			</View>
		);	
	}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 4,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default SeekerTest;
