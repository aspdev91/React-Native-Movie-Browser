import React, { Component } from 'react';
import {
  View,
  Text,
  Linking,
  Image,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

// Renders the detailed view once the user selects the movie

var MediaDetailView = React.createClass({
	render: function(){
		var item = this.props.mediaItem;
		var buyPrice = (item.trackHdPrice && item.trackPrice) ?
			<View style={styles.mediaPriceRow}>
				<Text style={styles.sectionTitle}>Buy</Text>
				<Text style={styles.mediaPrice}>${item.trackHdPrice} (HD)</Text>
				<Text style={styles.mediaPrice}>${item.trackPrice} (SD)</Text>
			</View> : null; 
		var rentalPrice = (item.trackHdRentalPrice && item.trackRentalPrice) ?
			<View style={styles.mediaPriceRow}>
				<Text style={styles.sectionTitle}>Rent</Text>
				<Text style={styles.mediaPrice}>${item.trackHdRentalPrice} (HD)</Text>
				<Text style={styles.mediaPrice}>${item.trackRentalPrice} (SD)</Text>
			</View> : null; 
		
		return(
			<ScrollView style={styles.contentContainer}>
				<Text style = {styles.mediaTitle} numberOfLines={2}>
					{item.trackName}
				</Text>
				<View style={styles.mainSection}>
					<Image
						source={{uri: item.artworkUrl100}}
						style={styles.mediaImage}
					/>
					<View style = {{flex: 1}}>
					  <View style = {[styles.mainSection, {
					  	alignItems: 'center',
					  	justifyContent: 'space-between'
					  }]}>
					    <View>
							<Text style ={styles.mediaGenre}>{item.primaryGenreName}</Text>
							<Text style ={styles.contentAdvisory}>{item.contentAdvisoryRating}</Text>
						</View>
					</View>
					<View style = {styles.separator}/> 
					
					{buyPrice}
					
					{rentalPrice}  
					</View>
				</View>
				<View style={styles.separator} />
				<Text style={styles.sectionTitle}>Description</Text>
				<Text style={styles.mediaDescription}>{item.longDescription}</Text>
				<View style ={styles.separator} />
				<TouchableHighlight
					onPress={() => Linking.openURL(item.trackViewUrl)}
				>
					<Text style={styles.iTunesButton}>
					View in iTunes
					</Text>
				</TouchableHighlight>
			</ScrollView>
		)
	}
})

var styles = StyleSheet.create({
	 contentContainer: {
	 	padding: 8
	 },
	 mainSection: {
	 	flexDirection: 'row',
	 },
	 separator: {
	 	backgroundColor: 'rgba(0,0,0,0.1)',
	 	height: 1,
	 	marginVertical: 20
	 },
	 sectionTitle: {
	 	fontWeight: 'bold',
	 	marginBottom: 4
	 },
	 mediaTitle: {
	 	fontSize: 18,
	 	fontWeight: 'bold',
	 	marginBottom: 8
	 },
	 mediaPriceRow: {
	 	flex: 1,
	 	flexDirection: 'row',
	 	justifyContent: 'space-between',
	 },
	 iTunesButton: {
	 	backgroundColor: '#FFF',
	 	fontSize: 16,
	 	fontWeight: 'bold',
	 	borderRadius: 4,
	 	color: '#666',
	 	borderWidth: 1,
	 	padding: 8,
	 	flexDirection: 'column',
	 	justifyContent: 'center'
	 },
	 mediaPrice: {
	 	color: '#666',
	 	textAlign: 'right'
	 },
	 mediaGenre: {
	 	fontStyle:'italic'
	 },
	 contentAdvisory:{
	 	fontFamily: 'Palatino',
	 	fontWeight: '600',
	 	fontSize: 16
	 },
	 mediaImage: {
	 	height: 100,
	 	width: 100,
	 	marginRight: 8,
	 	//CONTAINS the elements into the designated pixel size
	 	resizeMode: 'contain'
	 },
	 mediaDescription:{
	 	color:'#666',
	 	textAlign:'justify'
	 }
});

module.exports = MediaDetailView;