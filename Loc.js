import React, { Component } from 'react';
import SeekerTest from './SeekerTest';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';

export default class Loc extends Component {
  state = {
    location: { coords:{latitude:null,longitude:null} },
    target: {lat: 34.05879, lon: -118.3737},
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getPerms();
    }
    this.onRChange = this.onRChange.bind(this);
  }
  
  _getPerms = async () => {
	    let { status } = await Permissions.askAsync(Permissions.LOCATION);
	    if (status !== 'granted') {
	      this.setState({
	        errorMessage: 'Permission to access location was denied',
	      });
	    }
	    else {
		 	this._getLoc();  
		}
  }
  
  _getLoc() {
	    
	    this.watcher = Location.watchPositionAsync( { enableHighAccuracy: true, distanceInterval:0.01 }, (location) => {
//console.log( location );
		   this.setState({ location });
		});
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    this.setState({ location });
    
    this.watcher = Location.watchPositionAsync( { enableHighAccuracy: true, timeInterval:1000 }, (location) => {
//console.log( location );
	   this.setState({ location }, function() { console.log( 'yah after') });
	});
    
  };

  onRChange( region ) {
	console.log( region );  
  }
  
  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      /* text = JSON.stringify(this.state.location); */
      text = this.state.location.coords.latitude + ",\n" + this.state.location.coords.longitude + "\n\n" + this.state.location.coords.accuracy + "\n\n" + this.state.location.timestamp;
    }
    
    let mapv = (
	  	<Text style={{width:300,height:240}}>waiting</Text>  
	);
    if ( this.state.location.coords.latitude !== null ) {
	 	mapv = (
		  	<MapView style={{width:300,height:240}} region={{
				  	latitude: this.state.location.coords.latitude,
				  	longitude: this.state.location.coords.longitude,
				  	latitudeDelta: 0.001,
				  	longitudeDelta: 0.001
				}} onRegionChange={this.onRChange}><MapView.Marker coordinate={this.state.location.coords} /></MapView>
		);
	}
    
    return (
      <View>
      	<SeekerTest lat={this.state.location.coords.latitude} lon={this.state.location.coords.longitude} targetLat={this.state.target.lat} targetLon={this.state.target.lon} units="f" />
	  	{mapv}
	  	<Text style={styles.accura}>{this.state.location.coords.accuracy}</Text>
	  </View>
    );
  }
}
/*
	
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
 lat={this.state.location.coords.latitude}, lon={this.state.location.coords.longitude} targetLat={this.state.target.lat} targetLon={this.state.target.lon}	
*/


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  accura: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
	color: '#FFFFFF'	  
  }
});