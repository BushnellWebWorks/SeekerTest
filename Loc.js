import React, { Component } from 'react';
import SeekerTest from './SeekerTest';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
import * as firebase from 'firebase';

export default class Loc extends Component {
	constructor( props ) {
		super(props);
//		firebase.initializeApp( firebaseConfig );
	}


  state = {
    location: { coords:{latitude:null,longitude:null} },
	heading: { magHeading:null, trueHeading:null, accuracy:null },
    target: {lat: 34.05879, lon: -118.3737},
    mapRegion: {latitude:null, longitude:null,latitudeDelta:.001,longitudeDelta:.001},
    mapNeedsChanging: false,
    markerPosition: {latitude:null, longitude:null},
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
    this.onRChangeComplete = this.onRChangeComplete.bind(this);
    this.onZoomHere = this.onZoomHere.bind(this);
    this.onSetTarget = this.onSetTarget.bind(this);
    this.mapRegionBusy = false;
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
	    
	    Location.watchPositionAsync( { enableHighAccuracy: true, distanceInterval:0.01 }, (location) => {
//console.log( location );
		   this.setState({ location });
		});
		
		Location.watchHeadingAsync( heading => {
			this.setState({ heading });
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
	this.setState({markerPosition:region}); 
	if ( this.mapRegionBusy ) { return; }
	this.mapRegionBusy = true;
	this.setState({mapRegion:region},
		() => {this.mapRegionBusy = false;}
	); 
  }
  
 onRChangeComplete( region ) {
	this.setState({mapRegion:region}); 
  }
  
  onSetTarget( ev ) {
	  this.setState({target: {
			lat: this.state.mapRegion.latitude,
			lon: this.state.mapRegion.longitude
	  }});
	  /*
	  firebase.database().ref('testing/test2').push({
			targetLat: this.state.mapRegion.latitude,
			targetLon: this.state.mapRegion.longitude
	  });
	  */
  }
  
  onZoomHere( ev ) {
		this.setState({mapNeedsChanging:true}, () => {
			this.setState({mapRegion:{
				latitude: this.state.location.coords.latitude,
				longitude: this.state.location.coords.longitude,
				latitudeDelta: .0001,
				longitudeDelta: .0001
			},
			markerPosition:this.state.location.coords
			}, () => {
				this.setState({mapNeedsChanging:false})
			}); 
		}); 
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
/*	if ( this.state.mapRegion.latitude !== null ) {
console.log( 'mapRegion latitude');
console.log( this.state.location.coords.accuracy );
		mapv = (
		  	<MapView style={{width:300,height:240}} mapType="hybrid" region={this.state.mapRegion} initialRegion={this.state.mapRegion} onRegionChange={this.onRChange}>
		  		<MapView.Marker coordinate={this.state.mapRegion} /></MapView>
		);
	}
    else */ 
    if ( this.state.location.coords.latitude !== null ) {
	 	const mapCoords = ( this.state.mapRegion.latitude !== null ) ? this.state.mapRegion : {
		 	latitude: this.state.location.coords.latitude,
		 	longitude: this.state.location.coords.longitude,
		 	latitudeDelta: 0.001,
		 	longitudeDelta: 0.001
		 }; 
	 	// const markerCoords = ( this.state.mapRegion.latitude !== null ) ? this.state.mapRegion : this.state.location.coords;
	 	const markerCoords = ( this.state.markerPosition.latitude !== null ) ? this.state.markerPosition : this.state.location.coords;
	 	
	 	if (this.state.mapNeedsChanging) {
		 	mapv = (
			  	<MapView style={{width:300,height:240}} mapType="hybrid" region={mapCoords} onRegionChange={this.onRChange}><MapView.Marker coordinate={markerCoords} /></MapView>
			);
		} else {
		 	mapv = (
			  	<MapView style={{width:300,height:240}} mapType="hybrid" initialRegion={mapCoords} onRegionChange={this.onRChange}><MapView.Marker coordinate={markerCoords} /></MapView>
			);
		}
	 	
	}
    
    return (
      <View>
      	<SeekerTest style={{flex:2}} 
      		lat={this.state.location.coords.latitude} 
      		lon={this.state.location.coords.longitude}
      		acc={this.state.location.coords.accuracy} 
      		targetLat={this.state.target.lat} 
      		targetLon={this.state.target.lon} 
      		heading={this.state.heading.trueHeading}
      		hacc={this.state.heading.accuracy} 
      		units="f" />
	  	{mapv}
	  	<View style={styles.sideBySide}><Button style={{width:99,height:52,flex:1}} onPress={this.onSetTarget} title="Set target   " /><Button style={{width:99,height:52,flex:1}} onPress={this.onZoomHere} title="   Zoom Here" /></View>
	  	<Text style={styles.accura}>Accuracy:{Math.round(10*this.state.location.coords.accuracy)/10}  
	  	 / Head: {Math.round(this.state.heading.trueHeading*10)/10}, {this.state.heading.accuracy}</Text>
	  </View>
    );
  }
}
/*


		<View style={styles.sideBySide}><Button onPress={this.onSetTarget} title="Set target" /><Button onPress={this.onZoomHere} title="Zoom Here" /></View>
	
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
  sideBySide: {
	flexDirection: 'row',
	margin:2,
	padding:2,
	height: 60,
	width:300
  },
  accura: {
    margin: 6,
    fontSize: 14,
    textAlign: 'center',
	color: '#FFFFFF'	  
  }
});