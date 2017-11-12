import React from 'react';
import Seeker from './Seeker';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { FontAwesome } from '@expo/vector-icons';


class Thataway extends Seeker {
	static defaultProps = { threshold: 5, units: 'f', showDistance:1 };

	render() {
		
		const distReadout = ( this.props.showDistance ) ? (
			<Text style={styles.distance}>
				{Math.round(this.state.target.d / 5) * 5} - {Math.round(this.state.target.dMax / 5) * 5} {this.props.units}
			</Text>
		) : null;
		
		return (
			<View style={[styles.container,{backgroundColor:'#0099CC'}]}>
				<View style={[styles.pointer, {transform:[{rotate:`${this.state.target.headingDelta}deg`}]}]}><FontAwesome style={styles.pointerArrow} name="arrow-up" /></View>
				{distReadout}
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
  pointer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pointerArrow: {
	color: '#FFFFFF',
	fontSize: 240  
  },
  distance: {
    margin: 4,
    fontSize: 14,
    textAlign: 'center',
  }
});

export default Thataway;
