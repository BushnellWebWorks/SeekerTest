import React from 'react';
import Seeker from './Seeker';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { FontAwesome } from '@expo/vector-icons';


class HowFar extends Seeker {
	static defaultProps = {
		threshold: 5,
		units: 'f',
		showDistance: 1,
		thresholdReached: () => {}
	};

	render() {
		
		return (
			<View style={[styles.container,{backgroundColor:'#004400'}]}>
				<Text style={styles.distance}>
					{Math.round(this.state.target.d / 5) * 5}
				</Text>
				<Text style={styles.distlabel}>{this.unitLabel[this.props.units]} away</Text>
				<Text style={styles.distlabel}>±{Math.round( (this.state.target.dMax - this.state.target.d) / 5 ) * 5} {this.unitLabel[this.props.units]}</Text>
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
    fontSize: 54,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  distlabel: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center'
  }
});

export default HowFar;
