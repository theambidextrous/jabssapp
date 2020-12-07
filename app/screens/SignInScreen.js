import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import * as Network from 'expo-network';
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import Feather from "react-native-vector-icons/Feather";
import { AuthContext } from "../components/context";
import { ScrollView } from "react-native-gesture-handler";
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from "@react-native-community/async-storage";
import { CheckBox } from 'react-native-elements';
import colors from "../config/colors";
import conf from "../config/configs";
import { apiLogin, apiUserInfo } from "../utils/network";

const wlogo = require("../assets/jabss-logo.png");

function SignInScreen({ navigation }) {
  const [data, setData] = React.useState({
    // email: "softbucket.io@gmail.com",
    // password: "Jabss@2020",
    email: "",
    password: "",
    rememberMe: false,
    isValidUser: true,
    isValidPassword: true,
  });
  const [preload, setPreload] = React.useState({ visible: false });
  const [hastouchid, setTouchID] = React.useState(false);
  const [touchinfo, setTouchInfo] = React.useState({
    email:null,
    token:null,
  });

  const { signIn } = React.useContext(AuthContext);
  
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  const emailInputChange = (val) => {
    setData({
      ...data,
      email: val,
      isValidUser:true,
    });
  };
  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
      isValidPassword:true,
    });
  };
  const loginHandler = () => {
    if ( validateEmail(data.email) === false ) {
      setData({
        ...data,
        isValidUser:false,
      });
      Alert.alert(
        "Sign in error",
        "Valid email address is required",
        [{ text: "Okay" }]
      );
      return;
    }else{
      setData({
        ...data,
        isValidUser:true,
      });
    }
    console.log('data', data);
    if ( data.password.trim().length < 8 ) {
      setData({
        ...data,
        isValidPassword:false,
      });
      Alert.alert(
        "Sign in error",
        "Valid password is required",
        [{ text: "Okay" }]
      );
      return;
    }else{
      setData({
        ...data,
        isValidPassword:true,
        isValidUser:true,
      });
    }
    let foundUser;
    setPreload({ visible: true });
    apiLogin(data)
      .then((found) => {
        foundUser = found;
        if (foundUser.status === 201) {
          Alert.alert(
            "Sign in error", 
            foundUser.message, 
            [{ text: "Okay" },]
          );
          setPreload({ visible: false });
          return;
        }
        if (foundUser.status !== 200) {
          Alert.alert(
            "Sign in error", 
            foundUser.message, 
            [{ text: "Okay" },]
          );
          setPreload({ visible: false });
          return;
        }
        setPreload({ visible: false });
        signIn(foundUser);
      })
      .catch((error) => {
        console.log("vvv " + error);
        Alert.alert("Access error!", "Network request error", [
          { text: "Okay" },
        ]);
        setPreload({ visible: false });
        return;
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      async function isConnectedDevice() {
        await Network.getNetworkStateAsync()
          .then((netstat) => {
            if(!netstat.isInternetReachable)
            {
              Alert.alert('Connection', 'Connection error, check your data',[{text:'Okay'}]);
              // return;
            }
            setPreload({visible:true});
            AsyncStorage.getItem('offlineAuth').then((offlineAuth) =>{
                let touchID = JSON.parse(offlineAuth);
                if(touchID !== null )
                  if( touchID.email !== undefined && validateEmail(touchID.email) && touchID.token !== undefined && touchID.token.length > 100 ){
                      setTouchInfo({
                        ...touchinfo,
                        email:touchID.email,
                        token:touchID.token,
                      });
                      LocalAuthentication.authenticateAsync({
                        promptMessage:Platform.OS === 'ios' ? "Use TouchID to access your account":"Use Fingerprint to access your account",
                        cancelLabel:"Let me login",
                        fallbackLabel:"",
                        disableDeviceFallback:true,
                      }).then((authenticated) => {
                        // console.log('authenticated', authenticated);
                        if(authenticated.success)
                        {
                          apiUserInfo(touchID.token)
                          .then( async (useres) => {
                            if( useres.status === 200 )
                            {
                              signIn(useres);
                              setPreload({visible:false});
                              return;
                            }
                            setPreload({visible:false});
                          })
                          .catch((usererror) => {
                            setPreload({visible:false});
                            return;
                          });
                        }
                      }).catch((authError) => {
                        console.log('authError', authError);
                      });
                      setPreload({visible:false});
                  }
                  setPreload({visible:false});
            }).catch((eff) => { 
              console.log(eff);
              setPreload({visible:false});
            } );
            return;
          })
          .catch((error) => {
            setPreload({visible:false});
            Alert.alert('Connection warning', 'Network service error occured',
            [{text:'Okay'}]
            );
          });
      }
      isConnectedDevice();
      return () => {
        // Do something when the screen is un-focused
        setPreload({ visible: false });
      };
    }, [])
  );
  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
    <LinearGradient colors={[colors.primary_darker, colors.primary_darker,colors.primary_dark, colors.primary_dark,colors.primary]} style={styles.container}>
      <StatusBar backgroundColor={colors.primary_darker} barStyle="light-content" />
      <View style={styles.logoCircle}>
          <Animatable.Image
            animation="bounceIn"
            duration={1}
            source={wlogo}
            resizeMode="contain"
            style={styles.logo}
          />
      </View>
      <Animatable.View duration={1} animation="fadeInUpBig" style={styles.footer}>
          <ScrollView style={styles.footerHolder}>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email address</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                underlineColorAndroid="transparent"
                keyboardType="email-address"
                style={[styles.textInput,{
                  borderColor:data.isValidUser ? colors.ef : colors.red
                }]}
                value={data.email}
                autoCapitalize="none"
                onChangeText={(val) => emailInputChange(val)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                secureTextEntry={true}
                value={data.password}
                style={[styles.textInput,{
                  borderColor:data.isValidPassword ? colors.ef : colors.red
                }]}
                autoCapitalize="none"
                onChangeText={(val) => handlePasswordChange(val)}
              />
            </View>
            {/* remember me */}
            <View style={[styles.inputContainer,{justifyContent:"center"}]}>
              <CheckBox
                containerStyle={styles.checkContainer}
                textStyle={styles.checkText}
                title="Remember me"
                checked={data.rememberMe}
                onPress={() =>{
                  setData({...data, rememberMe: !data.rememberMe});
                }}
              />
            </View>
            {/* buttons */}
            <View style={styles.button}>
              {/* login button */}
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => {
                  loginHandler();
                }}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                  style={styles.signIn}
                >
                  <Text style={styles.btnText}>
                    Sign in
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.btnLinks}>
              <TouchableOpacity
              style={{flex:1}}
                onPress={() => {
                  navigation.navigate("RequestPwdResetScreen");
                }}
              >
                <Text style={{ color: colors.primary, marginTop: 10 }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={{flex:1}}
                onPress={() => {
                  navigation.navigate("SignUpScreen");
                }}
              >
                <Text style={{ color: colors.primary, margin: 10 }}>
                  <Text style={{color:colors.grey}}>New here? </Text>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
      </Animatable.View>
      {/* activity indicator */}
     { preload.visible === true && (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary_dark} animating={preload.visible} size="large" />
        </View>
     )}
      {/* end indicator */}
    </LinearGradient>
    </KeyboardAvoidingView>
  );
}
export default SignInScreen;
const { height } = Dimensions.get("screen");
const height_logo = height * 0.19;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary_darker,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex:0,
    paddingBottom: 20,
  },
  logoCircle:{
    minHeight:Dimensions.get("screen").width*.44,
    width:Dimensions.get("screen").width*.44,
    backgroundColor:colors.white,
    borderWidth:3,
    borderColor:colors.primary_darker,
    zIndex:999999,
    justifyContent:"center",
    alignSelf:"center",
    alignItems:"center",
    position:"relative",
    top:Dimensions.get("screen").width*.15,
    borderRadius:100,
  },
  footer: {
    flex: 30,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom:40,
  },
  footerHolder:{
    top:Dimensions.get('screen').height*.06,
  },
  text_header: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 30,
  },
  
  logo: {
    marginTop:"1%",
    width: height_logo,
    height: height_logo,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 0,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  checkContainer:{
    backgroundColor:colors.white, 
    borderColor:colors.white
  },
  checkText:{
    color:colors.black_light,
    fontSize:18,
    fontWeight:'400',
    marginBottom:1,
  },
  btnLinks:{
    flexDirection:"column",
    marginTop:20,
    justifyContent:"center",
    alignItems: "center"
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  btnText:{
    color:colors.white,
    fontWeight:"700",
    fontSize:22,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  label: {
    color:colors.black_light,
    fontSize:18,
    fontWeight:'400',
    marginBottom:6,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    marginBottom:10,
    borderWidth:1,
    borderColor:colors.input,
    color: colors.black,
    height:50,
    borderRadius:30,
    textAlign: "center",
    fontSize: 18,
  },
  floatcon:{
    padding:10
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
    textAlign: "center"
  },
  button: {
    alignItems: "center",
    marginTop: 1,
    height:55,
    flex: 1,
    width: "100%",
  },
  signIn: {
    width: "100%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  signInHalf: {
    width: "48%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
