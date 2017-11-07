import React, { Component } from 'react';

class Seeker extends Component {
	constructor( props ) {
		super(props);
		this.state = {
			current: {
				lat:null, lon:null
			},
			last: {
				lat:null, lon:null	
			},
			delta: {
				lat:null, lon:null, d:null
			},
			start: {
				lat:null, lon:null,
				dlat:null, dlon:null, d:null
			},
			target: {
				lat:null, lon:null,
				dlat:null, dlon:null, d:null, lastD:null,
				heading:null,headingText:''	
			},
			withinThreshold: false,
			thresholdReached: false,
			towardAway:null
		}
	}
	
	updateDeltas( newProps ) {
		let d = this.calcDeltas(
			newProps.lat, newProps.lon,
			this.state.last.lat, this.state.last.lon
		);
		this.setState(
			(state) => ({ delta: {
				lat: d.dlat,
				lon: d.dlon,
				d: d.d
			}})
		);	
	}
	
	updateStartDeltas( newProps) {
		let d = this.calcDeltas(
			this.state.start.lat, this.state.start.lon,
			newProps.lat, newProps.lon
		);

		this.setState(
			(state) => ({ start: {
				lat: this.state.start.lat,
				lon: this.state.start.lon,
				dlat: d.dlat,
				dlon: d.dlon,
				d: d.d
			}})
		);
	}
	
	updateTargetDeltas( newProps ) {

		const d = this.calcDeltas(
			newProps.lat, newProps.lon,
			newProps.targetLat, newProps.targetLon
		);
		
		const lastD = ( this.state.target.d === null ) ? null : this.state.target.d;
		
		let heading = Math.atan( (this.state.target.lat - newProps.lat) / (newProps.lon - this.state.target.lon ) );
		if ( this.state.target.lon > newProps.lon ) { heading += Math.PI; }
		heading *= 180 / Math.PI;
		heading = ( heading +270 ) % 360;
		
		let headingText ='';
		
		if ( heading > 300 || heading < 60 ) { headingText += 'N'; }
		else if ( heading > 120 && heading < 240 ) { headingText += 'S'; }
		if ( heading > 30 && heading < 150 ) { headingText += 'E'; }
		else if ( heading > 210 && heading < 330 ) { headingText += 'W'; }
		
		this.setState(
			(state) => ({ target: {
				lat: newProps.targetLat,
				lon: newProps.targetLon,
				dlat: d.dlat,
				dlon: d.dlon,
				d: d.d,
				lastD,
				heading,
				headingText
				
			}})
		);
		
		if ( lastD !== null ) {
			let ta = 0;
			if ( d.d == lastD ) { return; }
			if ( lastD < d.d ) {
				ta = -1;
			}
			else if ( lastD > d.d ) {
				ta = 1;	
			}
			
			this.setState({
				towardAway: ta
			});	
		}

		this.setState({
				withinThreshold: ( d.d <= this.props.threshold )
			},
			() => {
				if ( !this.state.thresholdReached && this.state.withinThreshold ) {
					this.setState({ thresholdReached: true });
				}
			}
		);
	}
	
	calcDeltas( lat0, lon0, lat1, lon1 ) {
		let dlat = lat1 - lat0,
			dlon = lon1 - lon0,
			d  = this.calcDistApprox( lat0, lon0, lat1, lon1, this.props.units );
		return { dlat:dlat, dlon:dlon, d:d };
	}
	
	// Haversine Formula, units: 'k'(km), 'm' (meters), 'i' (miles), 'y' (yards), or 'f' (feet)
	calcDist( lat0, lon0, lat1, lon1, units='f' ) {
		let toRad = Math.PI / 180,
			rlat0 = toRad * lat0,
			rlat1 = toRad * lat1,
			deltaRLat = toRad * ( lat1 - lat0 ),
			deltaRLon = toRad * ( lon1 - lon0 ),
			
			sin2lat = Math.sin( deltaRLat * 0.5 ),
			sin2lon = Math.sin( deltaRLon * 0.5 ),
			dista = Math.cos( rlat0 ) * Math.cos( rlat1 );
		sin2lat *= sin2lat;
		sin2lon *= sin2lon;
		dista *= sin2lon;
		dista += sin2lat;

		let dist = 6371 * 2 * Math.atan2( Math.sqrt(dista), Math.sqrt( 1-dista ) );
		
		switch( units ) {
			case 'k':		// kilometers
				// do nothing, already in km
			break;
			case 'm':		//meters
				dist *= 1000;
			break;
			case 'i':		//miles
				dist *= 0.62137119;
			break;
			case 'y':		// yards
				dist *= 1093.61329;
			break;
			case 'f':		// feet
			default:
				dist *= 3280.83988;
			break;				
		}
		return dist;
	}
	
	// Equirectangular approximation (small distances)
	calcDistApprox( lat0, lon0, lat1, lon1, units='f' ) {
		let toRad = Math.PI / 180,
			rlat0 = toRad * lat0,
			rlat1 = toRad * lat1,
			rlon0 = toRad * lon0,
			rlon1 = toRad * lon1,
			x = ( rlon1 - rlon0 ) * Math.cos( 0.5 * (rlat1 + rlat0 ) ),
			y = ( rlat1 - rlat0 ),
			dist = Math.sqrt( x*x + y*y ) * 6371; // 6371km is earth's radius
		switch( units ) {
			case 'k':		// kilometers
				// do nothing, already in km
			break;
			case 'm':		//meters
				dist *= 1000;
			break;
			case 'i':		//miles
				dist *= 0.62137119;
			break;
			case 'y':		// yards
				dist *= 1093.61329;
			break;
			case 'f':		// feet
			default:
				dist *= 3280.83988;
			break;				
		}
		return dist;
	}
	
	componentWillReceiveProps( newProps ) {
		if ( newProps.lat === null ) { return; }
		
		if ( this.state.start.lat === null ) {
			this.setState({ start: {
				lat: newProps.lat,
				lon: newProps.lon
			}},
				() => { this.updateStartDeltas( newProps ); }
			);
		} else {
			this.updateStartDeltas( newProps );	
		}
		
		this.setState(
			(state) => ({ last: {
				lat: this.state.current.lat,
				lon: this.state.current.lon
			}}),
			
			() => { 
				this.setState({
					current: {
						lat:newProps.lat,
						lon:newProps.lon
					}
				}, 
					() => {
						this.updateDeltas( newProps );
					}
				);
			}
			
		);
		
		this.updateTargetDeltas( newProps );
	}
	
	componentWillUpdate() {
// console.log( this.state );	
	}
}

Seeker.defaultProps = { threshold: 30, units: 'f' };

export default Seeker;
