import React from 'react';
import Seeker from './Seeker';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { FontAwesome } from '@expo/vector-icons';


class Thataway extends Seeker {
	static defaultProps = {
		threshold: 5,
		units: 'f',
		showDistance: 1,
		thresholdReached: () => alert('Target reached')
	};

	getVerbiage( heading ) {
		if ( heading > 340 || heading <= 20 ) {
			return 'Straight ahead';	
		}
		else if ( heading > 20 && heading <= 70 ) { 
			return 'Ahead to your right';	
		}
		else if ( heading > 70 && heading <= 110 ) {
			return 'To your right';
		}
		else if ( heading > 110 && heading <= 160 ) {
			return 'Back to your right';	
		}
		else if ( heading > 160 && heading <= 200 ) {
			return 'Behind you';	
		}
		else if ( heading > 200 && heading <= 250 ) {
			return 'Back to your left';	
		}
		else if ( heading > 250 && heading <= 290 ) {
			return 'To your left';	
		}
		else if ( heading > 290 && heading <= 340 ) {
			return 'Ahead to your left';	
		}
		else {
			return 'Not sure...'	
		}
	}
	
	render() {
		
		const distReadout = ( this.props.showDistance ) ? (
			<Text style={styles.distance}>
				{Math.round(this.state.target.d / 5) * 5} - {Math.round(this.state.target.dMax / 5) * 5} {this.unitLabel[this.props.units]}
			</Text>
		) : null;
		
		return (
			<View style={[styles.container,{backgroundColor:'#004400'}]}>
				<Text style={styles.verbiage}>{ this.getVerbiage( (360 + this.state.target.headingDelta ) % 360 ) }</Text>
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
  verbiage: {
	color: '#FFFFFF',
    textAlign: 'center',
	fontSize: 60,
	lineHeight: 55,
	paddingTop: 5,
	width: '92%'
  },
  distance: {
    margin: 4,
    fontSize: 14,
    textAlign: 'center',
    color: '#FFFFFF'
  }
});

export default Thataway;
