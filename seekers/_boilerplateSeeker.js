import React from 'react';
import Seeker from './Seeker';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { FontAwesome } from '@expo/vector-icons';


class _boilerplate extends Seeker {
	static defaultProps = { threshold: 5, units: 'f' };

	render() {
		
		return (
			<View style={styles.container}>
				<Text style={styles.paragraph}>
					latitude: {Math.round(this.state.current.lat*10e6)/10e6}<br />
					longitude: {Math.round(10e6*this.state.current.lon)/10e6}
				</Text>
				<Text style={styles.paragraph}>
					target latitude: {Math.round(this.state.target.lat*10e6)/10e6}<br />
					target longitude: {Math.round(this.state.target.lon*10e6)/10e6}
				</Text>
				<Text style={styles.paragraph}>
					distance to target:<br />
					{Math.round(this.state.target.d / 5) * 5} - {Math.round(this.state.target.dMax / 5) * 5} {this.props.units}</Text>
				<Text style={styles.paragraph}>
					heading: {this.state.target.headingText}<br />
					{Math.round(10*this.state.target.heading)/10} degrees
				</Text>
				<View style={{ transform:[{rotate:`${this.state.target.headingDelta}deg`}] }}><FontAwesome name="arrow-up" size={36} color="red" /></View>
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
    width: Dimensions.get('window').width
  },
  paragraph: {
    margin: 4,
    fontSize: 18,
    textAlign: 'center',
  }
});

export default _boilerplate;
