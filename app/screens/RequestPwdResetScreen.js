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
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../components/context";
import { ScrollView } from "react-native-gesture-handler";

import Modal from 'react-native-modal';

import colors from "../config/colors";
import {
  apiReqReset,
  apiVerifyReset,
  apiFinishReset
} from "../utils/network";

const wlogo = require("../assets/jabss-logo.png");

function RequestPwdResetScreen({ navigation }) {
  const [preload, setPreload] = React.useState({ visible: false });
  const [fieldvisible, setFieldVisible] = React.useState({
    email: true,
    code: false,
    passwordResetFields: false,
  });
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  const { signIn } = React.useContext(AuthContext);
  const [data, setData] = React.useState({
    email: "",
    code: "",
    password: "",
    c_password: "",
    check_emailInputChange: true,
    check_passwordInputChange: true,
    check_cpasswordInputChange: true,
  });
  const emailInputChange = (val) => {
    if (validateEmail(val)) {
      setData({
        ...data,
        email: val,
        check_emailInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_emailInputChange: false,
      });
    }
  };
  const passwordInputChange = (val) => {
    if (val.length >= 8) {
      setData({
        ...data,
        password: val,
        check_passwordInputChange: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        check_passwordInputChange: false,
      });
    }
  };
  const cpasswordInputChange = (val) => {
    if (val === data.password) {
      setData({
        ...data,
        c_password: val,
        check_cpasswordInputChange: true,
      });
    } else {
      setData({
        ...data,
        c_password: val,
        check_cpasswordInputChange: false,
      });
    }
  };

  const codeInputChange = (val) => {
    let vcode = val.replace(/\D/g,'');
    if (vcode.toString().length === 6) {
      setData({ ...data, code: val});
      setPreload({visible: true});
      if (!validateEmail(data.email)) {
        setPreload({visible: false});
        Alert.alert("Account Error", "Email address is missing", [
          { text: "Okay" },
        ]);
        return;
      }
      let foundUser;
      apiVerifyReset(vcode, data.email)
        .then((found) => {
          console.log(found);
          foundUser = found;
          if (foundUser.status !== 200) {
            setPreload({visible: false});
            Alert.alert("Verification error", foundUser.message, [
              { text: "Okay" },
            ]);
            return;
          }else
          {
            setFieldVisible({...fieldvisible, code:false});
            setTimeout( () => {
              setFieldVisible({ code:false, email:false, passwordResetFields: true});
            }, 500);
            console.log(fieldvisible);
            setPreload({ visible: false });
            return;
          }
        })
        .catch((error) => {
          setPreload({visible: false});
          Alert.alert("Password reset error", 'No internet reach', [
            { text: "Okay" },
          ]);
          return;
        });
    } else {
      setData({
        ...data,
        code: val,
      });
    }
  };
  const resendHandler = () => {
    setFieldVisible({
      email: true,
      code: false,
      passwordResetFields: false,
    });
  };
  const requestHandler = () => {
    if (!validateEmail(data.email)) {
      Alert.alert("Reset error", "A valid email address must be provided", [
        { text: "Okay" },
      ]);
      return;
    }
    let foundUser;
    setPreload({ visible: true });
    apiReqReset(data.email)
      .then((found) => {
        foundUser = found;
        if (foundUser.status !== 200) {
          setPreload({ visible: false });
          Alert.alert("Reset error!", foundUser.message, [
            {text: "Okay",},
          ]);
          return;
        }
        setFieldVisible({
          ...fieldvisible,
          email: false,
          code: true,
          passwordResetFields: false,
        });
        setPreload({ visible: false });
      })
      .catch((error) => {
        setPreload({ visible: false });
        Alert.alert("Access error!", error, [
          { text: "Okay" },
        ]);
        return;
      });
  };

  const changePasswordHandler = () => {
    if (data.password !== data.c_password) {
      Alert.alert("Password error", "Provided passwords must match", [
        { text: "Okay" },
      ]);
      return;
    }
    let foundUser;
    setPreload({ visible: true });
    let postData = {
      email: data.email,
      password: data.password,
      c_password: data.c_password,
    };
    apiFinishReset(postData)
      .then((found) => {
        foundUser = found;
        if (foundUser.status !== 200) {
          setPreload({ visible: false });
          Alert.alert(
            "Account error!",
            foundUser.message,
            [{ text: "Okay" }]
          );
          return;
        }else
        {
          setPreload({ visible: false });
          Alert.alert("Success!", "Password Changed!", [
            {
              text: "Okay, take me to login",
              onPress: () => {
                setFieldVisible({ ...fieldvisible, email: false, code: false, passwordResetFields: false,});
                navigation.navigate("SignInScreen");
              },
            },
          ]);
          return;
        }
      })
      .catch((error) => {
        setPreload({ visible: false });
        Alert.alert("Access error!", 'No internet reach', [
          { text: "Okay" },
        ]);
        return;
      });
  };
  return (
    <LinearGradient colors={[colors.primary_darker, colors.primary_darker,colors.primary_dark, colors.primary_dark,colors.primary]} style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={styles.logoCircle}>
        <Animatable.Image
          animation="bounceIn"
          duration={1500}
          source={wlogo}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView style={styles.footerHolder}>
          {/* phone */}
          {fieldvisible.email === true && (
            <View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email address</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  value={data.email}
                  placeholder=""
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => emailInputChange(val)}
                />
              </View>
              {data.check_emailInputChange === false && (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>Provide a valid email</Text>
                </Animatable.View>
              )}
              <View style={styles.button}>
                {/* login button */}
                <TouchableOpacity
                  style={styles.signIn}
                  onPress={() => {
                    requestHandler();
                  }}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                    style={styles.signIn}
                  >
                    <Text style={styles.btnText}>
                    Reset
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {/* MODAL ======= verification */}
          <Modal animationIn="slideInUp" animationInTiming={1000} isVisible={fieldvisible.code}>
            <View style={styles.modalContainer}>
              <View style={{flex:1}}>
                <View style={[styles.inputContainer, {justifyContent:"center",flexDirection:"column", marginBottom:0}]}>
                  <Text style={styles.modalTitle}>
                    Verification code
                  </Text>
                  <Text style={[styles.verifyLabel,{paddingRight:20, paddingLeft:20, marginTop:20,}]}>
                    Enter the verification code sent to your email
                  </Text>
                </View>
                <View style={[styles.inputContainer,{marginTop:0}]}>
                  <TextInput
                    placeholder="Enter verification code"
                    keyboardType='numeric'
                    maxLength={6}
                    value={data.code}
                    style={[styles.textInput, {marginBottom:1,}]}
                    onChangeText={(val) => codeInputChange(val)}
                  />
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {resendHandler();}}>
                    <Text>
                      Didn't receive the code ?{" "}
                      <Text style={styles.resendLabel}>Resend Code</Text>
                    </Text>
                    <View>
                      { preload.visible === true && (
                        <View style={styles.loading}>
                          <ActivityIndicator color={colors.secondary} animating={preload.visible} size="large" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* END ================= */}
          {/* MODAL ======= Actual reset */}
          <Modal animationIn="slideInUp" animationInTiming={100} isVisible={fieldvisible.passwordResetFields}>
            <View style={styles.modalContainerB}>
              <View style={{flex:1}}>
                <View style={[styles.inputContainer, {justifyContent:"center",flexDirection:"column", marginBottom:0}]}>
                  <Text style={styles.modalTitle}>
                    Reset password
                  </Text>
                </View>
                  {/* password */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      secureTextEntry={true}
                      value={data.password}
                      style={styles.textInput}
                      autoCapitalize="none"
                      onChangeText={(val) => passwordInputChange(val)}
                    />
                  </View>
                  {data.check_passwordInputChange === false && (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                      <Text style={styles.errorMsg}>Enter atleast 8 characters</Text>
                    </Animatable.View>
                  )}
                  {/* confirm password */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm password</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder=""
                      secureTextEntry={true}
                      value={data.c_password}
                      style={styles.textInput}
                      autoCapitalize="none"
                      onChangeText={(val) => cpasswordInputChange(val)}
                    />
                  </View>
                  {data.check_cpasswordInputChange === false && (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                      <Text style={styles.errorMsg}>Passwords do no match</Text>
                    </Animatable.View>
                  )}

                  <View style={styles.button}>
                    <TouchableOpacity
                      style={styles.signIn}
                      onPress={() => {
                        changePasswordHandler();
                      }}
                    >
                      <LinearGradient
                        colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                        style={styles.signIn}
                      >
                        <Text style={styles.btnText}>Update</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
              </View>
            </View>
          </Modal>
          {/* END ================= */}
          {/* buttons */}
          <View style={styles.btnLinks}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignInScreen");
              }}
            >
              <Text style={{ color: colors.primary, margin: 10 }}>
                 Login Instead
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
      {/* activity indicator */}
     { preload.visible === true && (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary_darker} animating={preload.visible} size="large" />
        </View>
     )}
      {/* end indicator */}
    </LinearGradient>
  );
}
export default RequestPwdResetScreen;
const { height } = Dimensions.get("screen");
const height_logo = height * 0.20;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalContainer:{
    backgroundColor: colors.white,
    flex:1,
    flexDirection:"row",
    padding:20,
    borderRadius:40,
    maxHeight:Dimensions.get('screen').height*0.5,
  },
  modalContainerB:{
    backgroundColor: colors.white,
    flex:1,
    flexDirection:"row",
    padding:20,
    borderRadius:40,
    maxHeight:Dimensions.get('screen').height*0.6,
  },
  header: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
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
    top:Dimensions.get('screen').height*.09,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
    textAlign:"center"
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 0,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 0,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
    textAlign:"center",
  },
  resendLabel:{
    color:colors.primary_dark,
    fontWeight:"400",
    fontSize:15,
  },
  modalTitle:{
    color:colors.secondary,
    textAlign:"center",
    fontWeight:"700",
    fontSize:22,
  },
  verifyLabel:{
    color:colors.primary_dark,
    fontWeight:"700",
    textAlign:"center",
    fontSize:16,
  },
  btnText:{
    color:colors.white,
    fontWeight:"700",
    fontSize:22,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
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
    // paddingLeft: 10,
    marginBottom:10,
    borderWidth:1,
    borderColor:colors.primary_darker,
    color: colors.black,
    height:55,
    borderRadius:30,
    textAlign: "center",
    fontSize: 18,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 20,
    height:55,
    flex: 1,
    width: "100%",
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logo: {
    marginTop:"10%",
    width: height_logo,
    height: height_logo,
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
