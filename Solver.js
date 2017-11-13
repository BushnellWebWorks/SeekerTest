import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Picker, Button, Modal, TouchableHighlight, WebView, Alert } from 'react-native';
import { Constants } from 'expo';
import { FontAwesome } from '@expo/vector-icons';

export default class Solver extends React.Component {
	constructor( props ) {
		super( props );
		this.onViewMessage = this.onViewMessage.bind(this);
	}
	
	static defaultProps = { 
		question: 'The answer is "Orlando"',
		answer: 'orlando',
		hint: "Here's a hint.",
		onQuit: () => {Alert.alert(
				'Give up',
				'I give up.',
				[{text:'Okay'}],
				{cancelable:true}
			)},
		onCorrect: () => {Alert.alert(
				'Correct!',
				'That is the correct answer.',
				[{text:'Okay'}],
				{cancelable:true}
			)},
		onRemount: () => {Alert.alert(
				'Remount occurs',
				'Seeker would be reloaded now.',
				[{text:'Okay'}],
				{cancelable:true}
			)}
	}
	
	onViewMessage( ev ) {
		if ( ev.nativeEvent.data == '@_quit_@' ) {
			this.props.onQuit();
		} else if ( ev.nativeEvent.data.toLowerCase().trim() == this.props.answer.toLowerCase() ) {
			this.props.onCorrect();
		} else {
			Alert.alert(
				'Incorrect.',
				'That is the wrong answer.',
				[{text:'Okay'}],
				{cancelable:true}
			);
		}
	}
	
	render() {
		
		const sourceAttr = ( this.props.url ) ? (
			{uri:this.props.url}
		):(
			{html:this.htmlTemplate}
		);
		
		return (
			<View style={styles.container}>
				<WebView
					source={sourceAttr}
			        scalesPageToFit
			        javaScriptEnabled
			        onMessage={this.onViewMessage}
			        style={styles.webView}
			        injectedJavaScript={this.setupJS} />
				<View style={styles.bottomPanel}>
					<TouchableHighlight
						onPress={this.props.onRemount}>
							<FontAwesome name="rotate-left" style={[styles.bottomIcon]} />
					</TouchableHighlight>
					<TouchableHighlight
						onPress={() => Alert.alert(
							'Hint',
							this.props.hint,
							[{text:'Okay'}],
							{cancelable:true}
						)}>
							<FontAwesome name="question-circle" style={[styles.bottomIcon]} />
					</TouchableHighlight>
				</View>
			</View>
		);
	} // end render

	htmlTemplate = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<title>GPSHunts</title>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
			<style>
				body {
					font-family: Helvetica,sans-serif;
					font-size: 18px;
					text-align:center;
					margin:36px 18px;	
				}
				body * { box-sizing: border-box; }
				p { margin: 1em 0; }
				.btn, .branded {
					border-radius: 0.5em;
					display:block;
					margin: 1em 0;
					padding: 1em;
					width: 100%;
					font-weight: bold;
					-webkit-appearance:none;
					appearance:none;
					outline:none;
					font-size: 1rem;
					border:none;
				}
				.btn:focus, .branded:focus {
					outline:none;
				}
				.btn {
					box-shadow: 1px 4px 4px 2px rgba(0,0,0,0.25);
				}
				.btn_primary {
					background-color: #080;
					color: #FFFFFF;
				}
				.btn_default {
					background-color: transparent;
					color: #080;
					border: 2px solid #080;
				}
			</style>
		</head>
		<body>
			<p>${this.props.question}</p>
			<form action="javascript:void(0)">
				<input class="branded btn_default" id="gpshInput" placeholder="Answer">
				<button id="gpshSubmit" class="btn btn_primary">Submit</button>
				<button id="gpshQuit" class="btn btn_default">I give up</button>
			</form>
		</body>
		</html>	
	`; // end htmlTemplate

	setupJS = `
		if ( document.getElementById('gpshSubmit').form ) {
			document.getElementById('gpshSubmit').form.addEventListener('submit', function(ev) {
				window.postMessage( document.getElementById('gpshInput').value );
				ev.stopPropagation();
				ev.preventDefault();
			})
		}
		document.getElementById('gpshSubmit').addEventListener('click', function(ev) {
			window.postMessage( document.getElementById('gpshInput').value );
			ev.preventDefault();
		});
		document.getElementById('gpshQuit').addEventListener('click', function(ev) {
			window.postMessage( '@_quit_@' );
			ev.preventDefault();
		});
		document.getElementById('gpshInput').focus();
	`;
} // end class


const styles = StyleSheet.create({
  sview: {
  },
  container: {
    flex: 1,
//    alignItems: 'center',
//    justifyContent: 'center',
  },
  webView: {
	flex:1,
	width:Dimensions.get('window').width  
  },
  bottomPanel:{
	flexDirection:'row',
	padding: 6,
	alignItems: 'center',
	justifyContent: 'space-between',
	backgroundColor:'#444'
  },
  bottomIcon:{
	fontSize: 36,
	marginHorizontal: 12,
	color: '#FFFFFF'  
  }
});
