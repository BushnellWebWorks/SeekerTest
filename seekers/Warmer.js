import React from 'react';
import Seeker from './Seeker';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { FontAwesome } from '@expo/vector-icons';


class Warmer extends Seeker {
	static defaultProps = {
		threshold: 5,
		units: 'f',
		showDistance: 1,
		thresholdReached: () => alert('Target reached')
	};

	getTowardAway() {
		if ( this.state.towardAway === null ) { return null; }
		switch ( this.state.towardAway ) {
			case -1:
				return (
					<View style={styles.readout}>
						<FontAwesome name="thermometer-1" style={[styles.thermometer,styles.thermo_colder]} />
						<Text style={[styles.warmcold,styles.colder]}>Colder</Text>
					</View>
				);
			break;
			case 1:
				return (
					<View style={styles.readout}>
						<FontAwesome name="thermometer-4" style={[styles.thermometer,styles.thermo_warmer]} />
						<Text style={[styles.warmcold,styles.warmer]}>Warmer</Text>
					</View>
				);
			break;
			case 0:
				return (
					<View style={styles.readout}>
						<FontAwesome name="circle-o" style={[styles.thermometer,styles.thermo_nochange]} />
						<Text style={[styles.warmcold,styles.nochange]}>No Change</Text>
					</View>
				);
			break;	
		}
	}
	
	getBGColor() {
		switch ( this.state.towardAway ) {
			case -1:
				return '#0077aa';
			break;
			case 1:
				return '#FF7000';
			break;
			case 0:
				return '#BBBBBB';
			break;
		}
	}
	
	render() {
		
		return (
			<View style={[styles.container,{backgroundColor:this.getBGColor()}]}>
				{this.getTowardAway()}
				<Text style={styles.distance}>
					{Math.round(this.state.target.d / 5) * 5} - {Math.round(this.state.target.dMax / 5) * 5} {this.props.units}
				</Text>
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
    backgroundColor: '#FFF',
    width: Dimensions.get('window').width
  },
  readout: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thermometer: {
	  fontSize: 72
  },
  warmcold: {
	  fontSize: 36,
	  fontWeight: 'bold'
  },
  colder: {
	  color: '#FFFFFF'
  },
  warmer: {
	  color: '#000000'
  },
  nochange: {
	  color: '#666666'
  },
  thermo_colder: {
	  color: '#77ffff'
  },
  thermo_warmer: {
	  color: '#990000'
  },
  thermo_nochange: {
	  color: '#666666'
  },
  distance: {
    margin: 4,
    fontSize: 14,
    textAlign: 'center',
  }
});

export default Warmer;
