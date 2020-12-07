import React from "react";
import {
  View,
  // Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from "react-native";

import ActionSheet from 'react-native-actionsheet'
import * as Animatable from "react-native-animatable";
import { Text } from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import Feather from "react-native-vector-icons/Feather";
import { AuthContext } from "../components/context";
import { CheckBox } from 'react-native-elements';
// import { useTheme } from "react-native-paper";
import { apiSignUp,apiResendCode, apiVerifySignup, apiAddCard,enc } from "../utils/network";
const wlogo = require("../assets/jabss-logo.png");
import colors from "../config/colors";
import { ScrollView } from "react-native-gesture-handler";
import { Constants } from "react-native-unimodules";
import Modal from 'react-native-modal';
import TermsOfUse from "../utils/TermsOfUse";
import { Ionicons } from '@expo/vector-icons';

// import { Icon } from "react-native-vector-icons/Icon";


function SignUpScreen({ navigation }) {
  const [vdata, setVData] = React.useState({
    code:"",
    token:null,
    user:[],
  });
  const [carddata, setCardData] = React.useState({ 
    cardname:'',
    mask:'',
    pan:'',
    exp:'',
    fingerprint:'',
    pciprint:'',
    isvalidcardname:true,
    isvalidpan:true,
    isvalidexp:true,
    isvalidfingerprint:true
  });
  const [data, setData] = React.useState({
    fname: "",
    lname: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
    password: "",
    c_password: "",
    terms:false,
    check_fnameInputChange: true,
    check_lnameInputChange: true,
    check_addressInputChange: true,
    check_cityInputChange: true,
    check_stateInputChange: true,
    check_zipInputChange: true,
    check_emailInputChange: true,
    check_phoneInputChange: true,
    check_passwordInputChange: true,
    check_cpasswordInputChange: true,
  });
  const [preload, setPreload] = React.useState({ visible: false });
  const [formerror, setFormError] = React.useState(0);
  const { signUp } = React.useContext(AuthContext);
  const [session, setSession] = React.useState({ showform: true});
  const [fieldvisible, setFieldVisible] = React.useState({
    terms: false,
    code:false,
    card:false,
  });
  const showTermsModal = () => {
    setFieldVisible({...fieldvisible, terms:!fieldvisible.terms});
  }
  const resendVerification = () => {
    
  }
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  const validatePhone = (v) => {
    var phoneno = /^\d{10}$/;
    if( v.match(phoneno) ){
      return true;
    }else{
      return false;
    }
  }
  const fnameInputChange = (val) => {
    setData({
      ...data,
      fname: val,
      check_fnameInputChange: true,
    });
  };
  const lnameInputChange = (val) => {
    setData({
      ...data,
      lname: val,
      check_lnameInputChange: true,
    });
  };
  const addressInputChange = (val) => {
    setData({
      ...data,
      address: val,
      check_addressInputChange: true,
    });
  };
  const cityInputChange = (val) => {
    setData({
      ...data,
      city: val,
      check_cityInputChange: true,
    });
  };
  const stateInputChange = (val) => {
    setData({
      ...data,
      state: val,
      check_stateInputChange: true,
    });
  };
  const zipInputChange = (val) => {
    setData({
      ...data,
      zip: val,
      check_zipInputChange: true,
    });
  };
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
  const phoneInputChange = (val) => {
    if (validatePhone(val)) {
      setData({
        ...data,
        phone: val,
        check_phoneInputChange: true,
      });
    } else {
      setData({
        ...data,
        phone: val,
        check_phoneInputChange: false,
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
      setVData({ ...vdata, code: vcode});
      setPreload({visible: true});
      apiVerifySignup(vcode, vdata.token)
      .then((response) => {
        console.log(response);
        if( response.status === 200 )
        {
          Alert.alert(
            "Account verified",
            response.message,
            [{ 
              text: "Okay",
              onPress: () => {
                setSession({showform:false});
                setFieldVisible({...fieldvisible,terms:false, code:false});
                setTimeout( () => {
                  setFieldVisible({...fieldvisible,code:false,card:true});
                }, 500);
              },
            }]
          );
          setPreload({visible:false});
          return;
        }
        setPreload({visible:false});
        Alert.alert(
          "Verification error",
          response.message,
          [{ text: "Okay" }]
        );
        return;
      })
      .catch((errormessage) => {
        setPreload({visible:false});
        Alert.alert(
          "Connection error",
          'No internet reach',
          [{ text: "Okay" }]
        );
        return;
      });
      return;
    }else {
      setVData({ ...vdata, code: val});
      return;
    }
  }
  const resendHandler = () => {
    setPreload({visible:true});
    apiResendCode(vdata.token)
    .then((response) => {
      if( response.status === 200 )
      {
        setPreload({visible:false});
        Alert.alert(
          "Verification Code",
          response.message,
          [{ text: "Okay" }]
        );
        return;
      }
      setPreload({visible:false});
        Alert.alert(
          "Verification error",
          response.message,
          [{ text: "Okay" }]
        );
        return;
    })
    .catch((errors) => {
      setPreload({visible:false});
      Alert.alert(
        "Connection error",
        'No internet reach',
        [{ text: "Okay" }]
      );
      return;
    });
  }
  const cardnameInputChange = (val) => {
    if ( val.length >= 5 ) {
      setCardData({
        ...carddata,
        cardname: val,
        isvalidcardname:true
      });
    } else {
      setCardData({
        ...carddata,
        cardname: val,
        isvalidcardname:false
      });
    }
  };
  const cardInputChange = (val) => {
    if ( val.length >= 13 ) {
      setCardData({
        ...carddata,
        pan: val,
        isvalidpan:true
      });
    } else {
      setCardData({
        ...carddata,
        pan: val,
        isvalidpan:false
      });
    }
  };
  const validateexp = (val) => {
    if( (val.replace('/', '')).length <= 2)
    {
      return val.replace('//', '/');
    }
    if( (val.replace('/', '')).length === 3)
    {
      return (val.charAt(0) + val.charAt(1) + '/' + val.charAt(2)).replace('//', '/');
    }
    if( (val.replace('/', '')).length === 4)
    {
      return (val.charAt(0) + val.charAt(1) + val.charAt(2) + val.charAt(3) + val.charAt(4)).replace('//', '/');
    }
    if( val.length === 5)
    {
      return (val.charAt(0) + val.charAt(1) + val.charAt(2) + val.charAt(3) + val.charAt(4)).replace('//', '/');
    }
  }
  const expInputChange = (val) => {
    if ( val.length <= 5 ) {
      setCardData({
        ...carddata,
        exp:validateexp(val),
        isvalidexp:true,
      });
    }else
    {
      setCardData({
        ...carddata,
        exp:validateexp(val),
        isvalidexp:false,
      });
    }
  };
  const cvvInputChange = (val) => {
    if ( val.length > 3 ) {
      setCardData({
        ...carddata,
        fingerprint:carddata.fingerprint,
        isvalidfingerprint:true,
      });
      return;
    }
    if ( val.length === 3 ) {
      setCardData({
        ...carddata,
        fingerprint:val,
        isvalidfingerprint:true,
      });
    }else
    {
      setCardData({
        ...carddata,
        fingerprint:val,
        isvalidfingerprint:false,
      });
    }
  };
  const clearcard = () => {
    setCardData({
      cardname:'',
      mask:'',
      pan:'',
      exp:'',
      fingerprint:'',
      pciprint:'',
      isvalidcardname:true,
      isvalidpan:true,
      isvalidexp:true,
      isvalidfingerprint:true
    });
    signUp(vdata.user);
    setFieldVisible({...fieldvisible, card:false});
    return;
  }
  const addCardHandler = () => {
    setPreload({visible: true});
    let panlength = carddata.pan.length;
    let mask = '********' + carddata.pan.substr(panlength - 4);
    let postData ={
      cardname:carddata.cardname,
      mask:mask,
      pan:enc(carddata.pan),
      exp:enc(carddata.exp),
      fingerprint:enc(carddata.fingerprint),
      pciprint:enc(carddata.cardname+carddata.exp),
    };
    apiAddCard(vdata.token, postData)
    .then((acard) => {
      console.log('card add', acard);
      if( acard.status !== 200 )
      {
        Alert.alert(
          'Card Error', 
          acard.message,
          [{
            text:'Try again', 
          }]
        );
        setPreload({visible:false});
        return;
      }else
      {
        Alert.alert(
          'Card Message', 
          acard.message,
          [{
            text:'Okay', 
            onPress:() => clearcard(),
          }]
        );
        setPreload({visible:false});
        return;
      }
    })
    .catch((cerror) => {
      console.log('card err', cerror);
      Alert.alert(
        'Network error', 
        'No internet reach',
        [{
          text:'Okay', 
        }]
      );
      setPreload({visible:false});
      return;
    })
  }
  const registerHandler = () => {
    if ( data.fname.length < 3 ) {
      setFormError(formerror + 1);
      setData({
        ...data,
        check_fnameInputChange:false
      });
    }
    if ( data.lname.length < 3 ) {
      setFormError(formerror + 1);
      setData({
        ...data,
        check_lnameInputChange:false
      });
    }
    if ( data.address.length < 5 ) {
      setData({...data,check_addressInputChange:false});
      return;
    }
    if ( data.check_cityInputChange === false || data.city.length === 0 ) {
      setData({...data,check_cityInputChange:false});
      return;
    }
    if ( data.check_stateInputChange === false || data.state.length === 0 ) {
      setData({...data,check_stateInputChange:false});
      return;
    }
    if ( data.check_zipInputChange === false || data.zip.length === 0 ) {
      setData({...data,check_zipInputChange:false});
      return;
    }
    if ( data.check_emailInputChange === false || data.email.length === 0 ) {
      setData({...data,check_emailInputChange:false});
      return;
    }
    if ( data.check_phoneInputChange === false || data.phone.length === 0 ) {
      setData({...data,check_phoneInputChange:false});
      return;
    }
    if ( data.check_passwordInputChange === false || data.password.length === 0 ) {
      setData({...data,check_passwordInputChange:false});
      return;
    }
    if ( data.check_cpasswordInputChange === false || data.c_password.length === 0 ) {
      setData({...data,check_cpasswordInputChange:false});
      return;
    }
    if ( ! data.terms ) {
      Alert.alert(
        "Terms and Conditions",
        'You must agree to our terms and conditions before creating an account with us',
        [{ text: "Okay" }]
      );
      return;
    }
    setPreload({ visible: true });
    let foundUser;
    apiSignUp(data)
      .then((found) => {
        foundUser = found;
        if (foundUser.status !== 200) {
          setPreload({ visible: false });
          Alert.alert(
            "Sign up error",
            foundUser.message,
            [{ text: "Okay" }]
          );
          return;
        }
        if (foundUser.status === 200 ) {
          let xtoken = foundUser.payload.token;
          // console.warn('token', xtoken);
          setVData({...vdata, user: foundUser, token: xtoken});
          setPreload({ visible: false });
          setFieldVisible({...fieldvisible, code:true});
          // signUp(foundUser);
          return;
        } else {
          setPreload({ visible: false });
          Alert.alert("Invalid Access!", foundUser.message, [
            { text: "Okay" },
          ]);
          return;
        }
      })
      .catch((error) => {
        setPreload({ visible: false });
        Alert.alert(
          "Connection error",
          'No internet reach',
          [{ text: "Okay" }]
        );
        return;
      });
  };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
      <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <SafeAreaView style={{flex:1}}>
      <Animatable.View animation="fadeInUpBig" duration={1} style={styles.footer}>
        <ScrollView>
          {/* logo */}
          <View style={styles.logoShow}>
            <Animatable.Image
              animation="bounceIn"
              duration={1}
              source={wlogo}
              height={100}
              width={100}
              style={{width:100,height:100}}
              // resizeMode="contain"
            />
          </View>
          { session.showform === true && (
            <View>
              {/* Fname */}
              <Text style={styles.label}>First name</Text>
              <View style={styles.action}>
                <TextInput
                  placeholder=""
                  value={data.fname}
                  style={[styles.textInput,{
                  borderColor:data.check_fnameInputChange ? colors.ef : colors.red
                  }]}
                  autoCapitalize="none"
                  onChangeText={(val) => fnameInputChange(val)}
                />
              </View>
              {/* Lname */}
              <Text style={styles.label}>Last name</Text>
              <View style={styles.action}>
                <TextInput
                  placeholder=""
                  value={data.lname}
                  style={[styles.textInput,{
                  borderColor:data.check_lnameInputChange ? colors.ef : colors.red
                  }]}
                  autoCapitalize="none"
                  onChangeText={(val) => lnameInputChange(val)}
                />
              </View>
              {/* Address */}
              <Text style={styles.label}>Address</Text>
              <View style={styles.action}>
                <TextInput
                  placeholder=""
                  keyboardType="numbers-and-punctuation"
                  value={data.address}
                  style={[styles.textInput,{
                  borderColor:data.check_addressInputChange ? colors.ef : colors.red
                  }]}
                  autoCapitalize="none"
                  onChangeText={(val) => addressInputChange(val)}
                />
              </View>
              {/* City */}
              <Text style={styles.label}>City</Text>
              <View style={styles.action}>
                <TextInput
                  placeholder=""
                  value={data.city}
                  style={[styles.textInput,{
                  borderColor:data.check_cityInputChange ? colors.ef : colors.red
                  }]}
                  autoCapitalize="none"
                  onChangeText={(val) => cityInputChange(val)}
                />
              </View>
              {/* ======= state zip ==== */}
              <View style={{flexDirection:"row"}}>
                <View style={{flex:1, marginRight:10,}}>
                  {/* Lname */}
                  <Text style={styles.label}>State</Text>
                  <View style={styles.action}>
                    <TextInput
                      placeholder=""
                      value={data.state}
                      style={[styles.textInput,{
                  borderColor:data.check_stateInputChange ? colors.ef : colors.red
                  }]}
                      autoCapitalize="none"
                      onChangeText={(val) => stateInputChange(val)}
                    />
                  </View>
                </View>
                <View style={{flex:1, marginLeft:10,}}>
                  {/* Lname */}
                  <Text style={styles.label}>Zip code</Text>
                  <View style={styles.action}>
                    <TextInput
                      placeholder=""
                      keyboardType="number-pad"
                      value={data.zip}
                      style={[styles.textInput,{
                  borderColor:data.check_zipInputChange ? colors.ef : colors.red
                  }]}
                      autoCapitalize="none"
                      onChangeText={(val) => zipInputChange(val)}
                    />
                  </View>
                </View>
              </View>
              {/* === end ===== */}
              {/* email */}
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.action}>
                <TextInput
                  placeholder=""
                  keyboardType="email-address"
                  value={data.email}
                  style={[styles.textInput,{
                  borderColor:data.check_emailInputChange ? colors.ef : colors.red
                  }]}
                  autoCapitalize="none"
                  onChangeText={(val) => emailInputChange(val)}
                />
              </View>
              {/* phone */}
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.action}>
                <TextInput
                  placeholder=""
                  value={data.phone}
                  keyboardType="number-pad"
                  style={[styles.textInput,{
                  borderColor:data.check_phoneInputChange ? colors.ef : colors.red
                  }]}
                  autoCapitalize="none"
                  onChangeText={(val) => phoneInputChange(val)}
                />
              </View>
              {/* password */}
              <Text style={[styles.label]}>Password</Text>
              <View style={styles.action}>
                <TextInput
                  placeholder=""
                  value={data.password}
                  secureTextEntry={true}
                  style={[styles.textInput,{
                  borderColor:data.check_passwordInputChange ? colors.ef : colors.red
                  }]}
                  autoCapitalize="none"
                  onChangeText={(val) => passwordInputChange(val)}
                />
              </View>
              {/* confirm password */}
              <Text style={[styles.label]}>
                Confirm password
              </Text>
              <View style={styles.action}>
                <TextInput
                  placeholder=""
                  secureTextEntry={true}
                  style={[styles.textInput,{
                  borderColor:data.check_cpasswordInputChange ? colors.ef : colors.red
                  }]}
                  autoCapitalize="none"
                  onChangeText={(val) => cpasswordInputChange(val)}
                />
              </View>
              {/* agree to terms */}
              <View>
                <CheckBox
                  containerStyle={styles.checkContainer}
                  textStyle={styles.checkText}
                  title={(<Text style={styles.termsText}>By clicking on "Sign up" you are agreeing to our <Text onPress={showTermsModal} style={styles.termsLink}> Terms & Conditions</Text></Text>)}
                  checked={data.terms}
                  onPress={() =>{
                    setData({...data, terms: !data.terms});
                  }}
                />
              </View>
              {/* buttons */}
              <View style={styles.button}>
                <TouchableOpacity
                  style={styles.signIn}
                  onPress={() => {
                    registerHandler();
                  }}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                    style={styles.signIn}
                  >
                    <Text style={styles.btnText}>
                      Sign up
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.btnLinks}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SignInScreen");
                  }}
                >
                  <Text style={{ color: colors.primary, margin: 10 }}>
                    <Text style={{color:colors.grey}}>Already have account? </Text>
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {/* Terms Modal  */}
          <Modal animationIn="slideInUp" animationInTiming={1000} isVisible={fieldvisible.terms}>
            <View style={styles.modalContainer}>
              <TermsOfUse/>
              <View style={{justifyContent:"center", alignSelf:"center",paddingTop:10}}>
                <TouchableOpacity onPress={showTermsModal} style={{flexDirection:"row"}}>
                  <Ionicons name="ios-checkmark-circle" size={30} color={colors.secondary} />
                  <Text style={{fontSize:22, marginLeft:4,}}>Okay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* end terms modal */}
          {/* Verification Modal  */}
          <Modal animationIn="slideInUp" animationInTiming={1000} isVisible={fieldvisible.code}>
            <View style={styles.modalContainerB}>
              <View style={{flex:1}}>
                <View style={[styles.inputContainer, {justifyContent:"center",flexDirection:"column", marginBottom:0}]}>
                  <Text style={styles.modalTitle}>
                    Almost done!
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
                    value={vdata.code}
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
            {/* activity indicator */}
            { preload.visible === true && (
                <View style={styles.loading}>
                <ActivityIndicator color={colors.primary_dark} animating={preload.visible} size="large" />
                </View>
            )}
            {/* end indicator */}
          </Modal>
          {/* end verification modal */}
          
          {/* add card MODAL */}
          <Modal animationIn="slideInUp" animationInTiming={100} isVisible={fieldvisible.card}>
              <ScrollView style={styles.modalContainerC}>
                <View style={{flex:1}}>
                  <View style={[styles.inputContainer, {justifyContent:"center",flexDirection:"column", marginBottom:0}]}>
                    <Text style={styles.modalTitle}>
                      Welcome {data.fname}
                    </Text>
                  </View>
                    {/* card */}
                    <Text style={[styles.label,{marginBottom:1, marginTop:15}]}>Card number</Text>
                    <View style={[styles.action,{marginTop:3}]}>
                      <TextInput
                        value={carddata.pan}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => cardInputChange(val)}
                      />
                    </View>
                    {carddata.isvalidpan === false && (
                      <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Invalid card number</Text>
                      </Animatable.View>
                    )}
                    {/* name */}
                    <Text style={[styles.label,{marginBottom:1}]}>Name on card</Text>
                    <View style={[styles.action,{marginTop:3}]}>
                      <TextInput
                        placeholder=""
                        value={carddata.cardname}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => cardnameInputChange(val)}
                      />
                    </View>
                    {carddata.isvalidcardname === false && (
                      <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Invalid name</Text>
                      </Animatable.View>
                    )}
                    {/* exp cvv */}
                    <View style={{flexDirection:"row"}}>
                      <View style={{flex:1, marginRight:10,}}>
                        {/* usd */}
                        <Text style={[styles.label,{marginBottom:1}]}>Exp. date</Text>
                        <View style={[styles.action,{marginTop:3}]}>
                          <TextInput
                            placeholder=""
                            value={carddata.exp}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => expInputChange(val)}
                          />
                        </View>
                        {carddata.isvalidexp === false && (
                          <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>use mm/yy format</Text>
                          </Animatable.View>
                        )}
                      </View>
                      <View style={{flex:1, marginLeft:10,}}>
                        {/* kes */}
                        <Text style={[styles.label,{marginBottom:1}]}>CVV</Text>
                        <View style={[styles.action,{marginTop:3}]}>
                          <TextInput
                            placeholder=""
                            secureTextEntry={true}
                            value={carddata.fingerprint}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => cvvInputChange(val)}
                          />
                        </View>
                        {carddata.isvalidfingerprint === false && (
                          <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Invalid value</Text>
                          </Animatable.View>
                        )}
                      </View>
                    </View>
                    <View style={styles.button}>
                      <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => {
                          addCardHandler();
                        }}
                      >
                        <LinearGradient
                          colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                          style={styles.signIn}
                        >
                          <Text style={styles.btnText}>Add card</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                </View>
              </ScrollView>
              {/* activity indicator */}
              { preload.visible === true && (
                  <View style={styles.loading}>
                  <ActivityIndicator color={colors.primary_dark} animating={preload.visible} size="large" />
                  </View>
              )}
              {/* end indicator */}
            </Modal>
            {/* END ================= */}

        </ScrollView>
      </Animatable.View>
      </SafeAreaView>
      {/* activity indicator */}
      { preload.visible === true && (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.secondary} animating={preload.visible} size="large" />
          </View>
      )}
        {/* end indicator */}
    </View>
    </KeyboardAvoidingView>
  );
}
export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalContainer:{
    backgroundColor: colors.white,
    // flex:1,
    flexDirection:"column",
    padding:20,
    borderRadius:40,
    height:Dimensions.get('screen').height*0.85,
  },
  modalContainerB:{
    backgroundColor: colors.white,
    // flex:1,
    flexDirection:"column",
    padding:20,
    borderRadius:40,
    height:Dimensions.get('screen').height*0.45,
  },
  modalContainerC:{
    backgroundColor: colors.white,
    flex:1,
    flexDirection:"column",
    padding:20,
    borderRadius:40,
    maxHeight:Dimensions.get('screen').height*0.75,
    // marginBottom:Dimensions.get('screen').height*0.08,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  checkContainer:{
    backgroundColor:colors.white, 
    borderColor:colors.white
  },
  checkText:{
    color:colors.black_light,
    fontSize:18,
    fontWeight:'400',
    marginBottom:6,
  },
  footer: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop:Constants.statusBarHeight*.5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  radio:{
    backgroundColor: colors.primary, 
    borderRadius:40,
    height:50,
    flex:1,
    margin:10,
    width:110
  },
  text_header: {
    color: "#fff",
    fontWeight: '900',
    fontSize: 16,
  },
  logoShow:{
    justifyContent:"center",
    alignSelf:"center",
    alignItems:"center",
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
    paddingBottom: 0,
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
  termsLink:{
    color:colors.secondary,
  },
  termsText:{
    color:colors.black_light,
    fontSize:18,
    fontWeight:'300',
    marginBottom:6,
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
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
    textAlign:"center",
  },
  button: {
    alignItems: "center",
    marginTop: 20,
    height:55,
    flex: 1,
    width: "100%",
  },
  btnLinks:{
    flexDirection:"row",
    marginTop:20,
    justifyContent:"center",
  },
  signIn: {
    width: "100%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  // modalContainerC:{
  //   backgroundColor: colors.white,
  //   // flex:1,
  //   flexDirection:"column",
  //   padding:20,
  //   borderRadius:40,
  //   height:Dimensions.get('screen').height*0.70,
  //   marginBottom:Dimensions.get('screen').height*0.08,
  // },
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
