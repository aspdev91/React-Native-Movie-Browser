import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  StatusBar,
  NavigatorIOS,
  AlertIOS
} from 'react-native';
import MediaListView from './media-list-view';



backgroundColor="blue"

// initial route is our root view, displayed when nav is displayed for the firs time 
class iTunesBrowser extends Component {
  render() {
    return (
      <NavigatorIOS
      style={styles.mainContainer}
      barTintColor='#2A3744'
      titleTextColor="#EFEFEF"
      initialRoute={{
        component: MediaListView,
        title:'iTunesBrowse        // rightButtonTitle: 'Search',
        // onRightButtonPress: () => AlertIOS.alert(
        //   'Search', 'You pressed the search button'
        //   )r',

        }}
      />
    );
  }
}

// stylesheets don't support inheritance  
// using points allows cross compatibility between multiple devices
// using pixelratio api allows you to automatically scale formatting 
// Pixel grid snapping in react native round pixel values to avoid rounding errors 

var styles = StyleSheet.create({
  mainContainer: {
    flex:1,
  }
}) 


var componentStyles = StyleSheet.create({
  titleItalic: {
    fontStyle:'italic',
    fontWeight: 'normal'
  }
})


AppRegistry.registerComponent('HelloWorld', () => iTunesBrowser);
