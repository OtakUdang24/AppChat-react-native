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

import { createStackNavigator, createAppContainer } from "react-navigation";

import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
// import console = require("console");
const BASE_URL = "http://192.168.43.251:3000/api/v1";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  async setItem(key, value) {
    try {
      return await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  }

  handleSubmit = () => {
    axios
      .post(`${BASE_URL}/login`, {
        email: this.state.email,
        password: this.state.password
      })
      .then(response => {
        console.log(response);
        if(response.data.success){
          this.setItem("token", response.data.token)
          this.props.navigation.navigate("GroupChat", {
            user: response.data.user
          });
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
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
            <Button block onPress={() => this.handleSubmit(this.setItem)}>
              <Text>Login</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
