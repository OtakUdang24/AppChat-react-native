import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Input,
  Item,
  Form,
  Button,
  Text
} from "native-base";

import { createStackNavigator, createAppContainer } from 'react-navigation';
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
const BASE_URL = "http://192.168.43.251:3000/api/v1";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  
  storeData = async (key, val) => {
    AsyncStorage.setItem(key, val);
  };

  handleSubmit = () =>{
    axios
      .post(`${BASE_URL}/login`, {
        email: this.state.email,
        password: this.state.password
      })
      .then(function(response) {
        // handle success
        // console.log(response)
        this.storeData("token", response.data.token)
        // if (response.data.success) {
          
          // AsyncStorage.setItem("token", response.data.token);
          // this.props.navigation.navigate("GroupChat");
        // }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
  };
  render() {
    return (
      <Container>
        <Header />
        <Content>
          <Form>
            <Item regular>
              <Input
                placeholder="Email"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />
            </Item>
            <Item regular>
              <Input
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
              />
            </Item>
            <Button block onPress={() => {this.handleSubmit()} }>
              <Text>Login</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
