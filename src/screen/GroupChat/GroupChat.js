import React, { Component } from "react";
import { Modal, StyleSheet, ScrollView, TouchableOpacity,TouchableHighlight, Alert, FlatList  } from "react-native";
// import { List, ListItem } from "react-native-elements";
import {
  Container,
  Header,
  Content,
  Input,
  Item,
  Form,
  Button,
  Text,
  Thumbnail,
  View,
  Left,
  Body,
  Right,
  Footer
} from "native-base";

import Spinner from 'react-native-loading-spinner-overlay';

import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Foundation from "react-native-vector-icons/Foundation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const arrowBack = <SimpleLineIcons name="logout" size={20} color="black" />;

import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";

const BASE_URL = "http://192.168.43.251:3000/api/v1";

export default class GroupChat extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    this.state = {
      user,
      message: "",
      messages: [],
      headerChange: false,

      id_message: '',
      selectedMessage: '',
      messageEdit: '',

      clickX: false,

      loading: false
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.fetchMessages()
    }, 500);
  }

  handleSend = () => {
    this.setState({
      loading: true
    })
    AsyncStorage.getItem("token").then(token => {
      axios
        .post(
          `${BASE_URL}/messages`,
          {
            message: this.state.message
          },
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        )
        .then(res => {
          this.setState({
            message: "",
            loading: false,

            id_message: '',
            headerChange: false,

            selectedMessage: '',
            messageEdit: '',
          });
          console.log(res);
        })
        .catch(err => console.log(res));
    });
  };

  fetchMessages = () => {
    AsyncStorage.getItem("token").then(token => {
      axios
        .get(`${BASE_URL}/messages`, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          this.setState({
            messages: res.data.rows
          });
          console.log(res);
        })
        .catch(err => console.log(err));
    });
  };

  handlerLongClick = (id, message) => {
    //handler for Long Click
    this.setState({
      headerChange: true,
      id_message: id,
      selectedMessage: message,
    })
  };

  handleRemove = (id) => {
    this.setState({
      loading: true
    })
    AsyncStorage.getItem("token").then(token => {
      axios
        .delete(`${BASE_URL}/messages/${id}`, 
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        )
        .then(res => {
          this.setState({
            id_message: '',
            headerChange: false,
            loading: false
          });
        })
        .catch(err => console.log(res));
    });
  }

  handleEdit = () => {
    this.setState({
      messageEdit: this.state.selectedMessage,
      headerChange: false,
      clickX: true
    })
  }

  handleSubmitEdit = () => {
    this.setState({
      loading: true
    })
    AsyncStorage.getItem("token").then(token => {
      axios
        .patch(`${BASE_URL}/messages/${this.state.id_message}`,
          {
            message: this.state.message
          }, 
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        )
        .then(res => {
          this.setState({
            id_message: '',
            message: '',
            headerChange: false,

            selectedMessage: '',
            messageEdit: '',
            
            loading: false,
            clickX: false
          });
        })
        .catch(err => console.log(res));
    });
  }

  logout = () => {
    AsyncStorage.clear();
    this.props.navigation.navigate("Login");
  }

  render() {
    const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";
    return (
      
      <Container>
        <Spinner
          visible={this.state.loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        {
          !this.state.headerChange ?
            <Header style={{ backgroundColor: "#FFFFFF" }}>
              <Left 
                style={{ flex: 1 }}
                
                >
                <TouchableOpacity onPress={this.logout}>
                  {arrowBack}
                </TouchableOpacity>
                
                </Left>
              <View
                style={{ flex: 8, alignItems: "center", justifyContent: "center" }}
              >
              <Text style={{ fontSize: 25 }}>Group Chat</Text>
              </View>
              <Right style={{ flex: 1 }}>
                <Thumbnail small source={{ uri: uri }} />
              </Right> 
            </Header>
            :
            <Header style={{ backgroundColor: "#FFFFFF" }}>
              <Left style={{ flex: 1 }}>{arrowBack}</Left>
              <View
                style={{ flex: 8, alignItems: "center", justifyContent: "center" }}
              >
              <Text style={{ fontSize: 25 }}>Group Chat</Text>
            </View>
            <Right style={{ flex: 1 }}>
              <View style={{marginRight: 12}}>
                <TouchableOpacity
                  onPress={() => this.handleEdit()}
                >
                  <Text>
                    <MaterialIcons name="mode-edit" size={25} color="black" />
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.handleRemove(this.state.id_message)}
                >
                  <Text>
                    <MaterialCommunityIcons name="delete" size={25} color="black" />
                  </Text>
                </TouchableOpacity>
              </View>
              
            </Right> 
      </Header>
        }
        
        <Content style={{ backgroundColor: "black" }}>
          <FlatList
            data={this.state.messages}
              
            renderItem={({item}) => (
              this.state.user.id == item.id_user ?
              <TouchableHighlight 
                activeOpacity={0.6}
                onLongPress={() => this.handlerLongClick(item.id_message, item.message)}
                onPress={() => {
                  this.setState({
                    headerChange: false,
                    messageEdit: '',
                    selectedMessage: '',
                    clickX: false,
                  })
                }}
              >
                <View style={{flex: 1, padding: 2, marginTop: 5}}>
                  <View
                    style={{ maxWidth: "80%", minWidth: "30%", marginLeft: "auto"}}
                  >
                    <View
                      style={{
                        backgroundColor: "#18ABFB",
                        padding: 10,
                        borderRadius: 5,
                      }}
                    >
                      <Text>{item.message}</Text>
                      <Text style={{fontSize: 8, textAlign: 'right', marginTop: 2}}>12:00</Text>
                    </View> 
                  </View>
                </View>
              </TouchableHighlight> :
              <TouchableOpacity activeOpacity={0.6}>
                <View style={{flex: 1, padding: 2, marginTop: 5}}>
                  <View
                    style={{ maxWidth: "80%", minWidth: "30%", marginRight: "auto"}}
                  >
                    <View
                      style={{
                        backgroundColor: "#EEEEEE",
                        padding: 10,
                        borderRadius: 5
                      }}
                    >
                      <Text style={{fontSize: 10, color: "#18ABFB"}}>{item.email}</Text>
                      <Text style={{marginTop: 5}}>{item.message}</Text>
                      <Text style={{ textAlign: "right", fontSize: 10 }}>12:00</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )} 
          >

          </FlatList>
        </Content>

        <View style={[{backgroundColor: '', padding: 15, flexDirection: 'row', }, !this.state.clickX ? {display: 'none'} : {}]}>
            <Text>{this.state.messageEdit}</Text>
            <Right>
              <TouchableOpacity
                onPress={
                  () => {
                    this.setState({
                      clickX: false,
                      messageEdit: '',
                      selectedMessage: '',
                      id_message: '',
                      
                    })
                  }
                }
              >
                <Text>
                  <AntDesign name="close" size={25} color="#18ABFB" />
                </Text>
              </TouchableOpacity>
              
            </Right>
        </View>  
        <View style={styles.footer}>
          <View style={{flexDirection: "row"}}>
            <Text style={styles.attachment}>
              <Entypo name="attachment" size={23} color="#CCCCCC" />
            </Text>
            <Item square style={styles.inputMessage}>
              <Input
                placeholder="Type a message..."
                placeholderTextColor="#CCCCCC"
                onChangeText={text => {
                  this.setState({
                    message: text
                  });
                }}
                value={this.state.message}
              />
            </Item>
            {
              this.state.messageEdit === "" ? (
                <TouchableOpacity style={styles.mic} onPress={this.state.message !== "" ? this.handleSend : null}>
                  <Text >
                    <MaterialCommunityIcons name="send" size={25} color={this.state.message === "" ? "#CCCCCC" : "#18ABFB"} />
                  </Text>
                </TouchableOpacity>
                
              ) :
              (
                <Text style={styles.mic} onPress={this.handleSubmitEdit}>
                <MaterialCommunityIcons name="send" size={25} color="#18ABFB" />
              </Text>
              )

            }
            {/* {this.state.message !== "" ? (
              <Text style={styles.mic} onPress={this.handleSend}>
                <MaterialCommunityIcons name="send" size={25} color="#18ABFB" />
              </Text>
            ) : (
              <Text style={styles.mic}>
                <Ionicons name="md-mic" size={25} color="#18ABFB" />
              </Text>
            )} */}
            </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    padding: 12,
    borderTopColor: "#e5e6e9",
    borderWidth: 1
  },
  attachment: {
    alignSelf: "center",
    marginRight: 12
  },
  telephone: {
    alignSelf: "center",
    marginRight: 15
  },
  inputMessage: {
    height: 40,
    flex: 1,
    marginRight: 15
  },
  mic: {
    alignSelf: "center"
  }
});
