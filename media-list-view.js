import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  AlertIOS,
  ActivityIndicator,
  ListView
} from 'react-native';

import TimerMixin from 'react-timer-mixin';

import MediaCell from './media-cell';

import MediaDetailView from './media-detail-view'

var API_URL = 'https://itunes.apple.com/search';

var LOADING = {};



// sample results cache 

var resultsCache = {
  dataForQuery:{}
}

var SearchBar = React.createClass({
  render: function(){
    return(
      <View style = {styles.searchBar}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false} 
          placeholder="Search for media on iTunes..."
          style={styles.searchBarInput}
          returnKeyType="search"
          enablesReturnKeyAutomatically={true}
          onChange={this.props.onSearch}
        />
        <ActivityIndicator
        animating={this.props.isLoading}
        style={styles.spinner}
        />
      </View>
      )
  }
});
// makes return key on keyboard "Search"
// onEndEditing={this.props.onSearch}
// ActivityIndicatorIOS is a native component 
// Runs the spinner when Loading stateis true 

var MediaListView = React.createClass({
  mixins: [TimerMixin],
  // 1 second timeout for each search query
  timeoutID: ( null: any  ),

  getInitialState: function() {
    return {
      isLoading: false,
      query: '',
      // Listview takes a datasource and a renderrow callback
      resultsData: new ListView.DataSource({
        rowHasChanged: (row1,row2) => row1 != row2
      })
    }
  },
  //this will run once the components have mounted
  componentDidMount: function(){
    this.searchMedia('mission impossible');
  },
  // this query runs when the query length is above 2
  // will output a api link for the fetch function
  _urlForQuery: function(query: string): string {
    if(query.length > 2) {
      return API_URL + '?media=movie&term=' + query;
    }
  },
  // accepts array of media items
  // checks Listview datasource
  // looks at both old and new and adds/replace the rows accordingly
  // React will differentiate and mutate the rows
  getDataSource: function(mediaItems: Array<any>): ListView.DataSource{
    return this.state.resultsData.cloneWithRows(mediaItems);
  },

  searchMedia: function(query: string){
    this.timeoutID = null;

    this.setState({ query: query })
    // accesses the cache for the  query results
    // will get undefined if it doesn't exist
    var cachedResultsForQuery = resultsCache.dataForQuery[query];
    
    if (cachedResultsForQuery){
      // if the query already exists in the cache and 
      // if there's no query being loaded, update the state with the results
      if(!LOADING[query]){
        this.setState({
          isLoading: false,
          resultsData: this.getDataSource(cachedResultsForQuery)
      });
     } 
    // unnecessary?
     // else {
     //    this.setState({
     //      isLoading: true
     //    })
     //  }; 
    } else {
      // if query results doesn't already exist in cache, go perform the query

      // get full api link for fetch
      var queryURL = this._urlForQuery(query);
      // error handler to make sure queryURL exists
      if(!queryURL) return;
        // if it isn't loading, load it and reset the query cache
        this.setState({
          isLoading: true
        });
        // console.log(LOADING[query])
        resultsCache.dataForQuery[query] = null;
        
        fetch(queryURL)
          // will provide a response or error in the form of response 
          .then((response) => response.json())
          //for error handling
          .catch((error) => {
            console.log("1",error)
            //reset loading and cache query in the state
            LOADING[query] = false;
            resultsCache.dataForQuery[query] = undefined;

            this.setState({
              isLoading: false,
              resultsData: this.getDataSource([])
            });
          })
          .then((responseData)=> {
            // removes all collection media items
            return responseData.results.filter((e) => e.wrapperType !== 'collection');
          })
          .then((responseData) => {
            console.log("rpd",responseData);
            LOADING[query] = false;
            // add the results to the cache
            resultsCache.dataForQuery[query] = responseData;
            console.log("1",responseData.results);
            // set the resultsData to the value
            this.setState({
              isLoading: false,
              resultsData: this.getDataSource(resultsCache.dataForQuery[query])
            })
          })
      }
    },

  render: function () {
    var content = null;
    // if results data contain no rows, return nothing
    if (this.state.resultsData.getRowCount() === 0){
      var text = '';
      // text is set to below when its done loading and query is added
      if(!this.state.isLoading && this.state.query){
        text = "No movies found for '" + this.state.query + "'."
      }
    }
    // return text in JSX form with styling if results row count = 0
    // in the form of the var "content"
    if(this.state.resultsData.getRowCount() === 0){
      content = <View style={styles.emptyList}>
        <Text style={styles.emptyListText}>{text}</Text>
      </View>
    } else{
      // set content to the Listview is rowcount > 0
      content = <ListView
          // gets the results of the query into the dataSource variable
          dataSource={this.state.resultsData}
          // render the rows of data
          renderRow={this.renderRow}
          // render a separator between each row 
          renderSeparator={this.renderSeparator}
          // adds the additional space to accomodate nav bar
          // Since we already adjusted in our styles, no need
          // to do it here
          automaticallyAdjustContentInsets={false}
          // dismiss keyboard when dragging on list view
          keyboardDismissMode='on-drag'
        />;
    }
    // display the searchbar
    // display content whether its the Listview or text indicating lack of
    // results data
    return(
        <View style={styles.content}> 
        <SearchBar 
          isLoading={this.state.isLoading}
          onSearch={(event) => {
            // console.log(event);
            var searchString = event.nativeEvent.text;
            // clears the timeout id
            this.clearTimeout(this.timeoutID);
            // sets the timeout to 100 and then, search media on the string 
            this.timeoutID = this.setTimeout(() => this.searchMedia(searchString), 1000);
          }}
        />
        <View style={[styles.separator, { marginLeft: 0}]} />

        {content}
        </View> 
      );
    },

  renderSeparator: function(
    // requires the params to be of a certain data type
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ){
    // if adjacentRowHighlighted is true, then add the style styles.listView.rowSeparatorHighlighted on 
    return (
      <View
      key={"SEP_" + sectionID + "_" + rowID}
      style={[styles.rowSeparator, adjacentRowHighlighted && styles.rowSeparatorHighlighted]}
      />
      )
  },

  renderRow: function(
    media: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunction: (sectionID: ?number | string, rowID: ?number | string) => void, 
    ){
    return(
      <MediaCell
        media={media}
        onSelect={() => this.selectMediaItem(media)}
        onHighlight={() => highlightRowFunction(sectionID,rowID)}
        onDeHighlight={() => highlightRowFunction(null, null)}
      />
      )
  },
  // this will run when the media item is selected
  selectMediaItem: function (mediaItem){
    this.props.navigator.push({
      //title
      title: 'Media Details',
      // 
      component: MediaDetailView,
      // will pass the props to MediaDetailView component from media-list-detail
      passProps: {
        mediaItem
      }
    })
  }
});

var styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#CCC',
    
    padding: 3,
  },
  searchBar: {
    marginTop: 64,
    padding: 3,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  searchBarInput: {
    fontSize: 15,
    flex: 1,
    height: 30
  },
  spinner: {
    width: 30
  },
  rowSeparator: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    height: 1,
    marginLeft: 4
  },
  rowSeparatorHighlighted: {
    opacity: 0.0
  },
  emptyList: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',

  },
  emptyListText: {
    marginTop: 80,
    color: '#999',
    fontSize: 20
  }
}) 

module.exports = MediaListView;