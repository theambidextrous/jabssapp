import React from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  AppState,
  Share,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import * as Network from 'expo-network';
import { useTheme } from "@react-navigation/native";
import { AuthContext } from "../components/context";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import colors from "../config/colors";
import Icon from "react-native-vector-icons/Ionicons";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import configs from "../config/configs";
import { apiPicUpdate, apiUserInfo,apiUpdateInfo,apiAddAddress,apiGetAddress,apiDeleteAddress } from "../utils/network";
/**  icons */

function PersonalInfoScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  const theme = useTheme();
  const [preload, setPreload] = React.useState({ visible: false });
  const [session, setSession] = React.useState({ token: null});
  const [updateVal, setUpdateVal] = React.useState(false);
  const [addresmodal, setAddressModal] = React.useState(false);
  const [profile, setProfile] = React.useState([]);
  const [places, setPlaces] = React.useState([]);
  const [data, setData] = React.useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    check_fnameInputChange: true,
    check_lnameInputChange: true,
    check_emailInputChange: true,
    check_phoneInputChange: true,
  });
  const [addressdata, setAddressData] = React.useState({
    address: "",
    city: "",
    state: "",
    zip: "",
  });
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
    if (val.length >= 3 ) {
      setData({
        ...data,
        fname: val,
        check_fnameInputChange: true,
      });
    } else {
      setData({
        ...data,
        fname: val,
        check_fnameInputChange: false,
      });
    }
  };
  const lnameInputChange = (val) => {
    if (val.length >= 3 ) {
      setData({
        ...data,
        lname: val,
        check_lnameInputChange: true,
      });
    } else {
      setData({
        ...data,
        lname: val,
        check_lnameInputChange: false,
      });
    }
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
  /** check if user is still active */
  const fUpper = (string) => {
    if(string === undefined)
      return;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const onShare = async () => {
    try {
      setPreload({visible:true});
      const result = await Share.share({
        message: configs.share_name,
        url: configs.share_url,
        title: configs.share_title,
      },{
        subject:configs.share_title,
        dialogTitle: configs.share_title,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('shared',result);
          setPreload({visible:false});
          // shared with activity type of result.activityType
        } else {
          // shared
          console.log('shared', result);
          setPreload({visible:false});
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('not shared', result);
        setPreload({visible:false});
      }
    } catch (error) {
      console.log(error.message);
      setPreload({visible:false});
    }
    setPreload({visible:false});
  };
  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissions required', 'You will not be able to update profile picture',[{text:'Okay'}]);
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setPreload({visible:true});
      const frm = new FormData();
      let localUri = result.uri;
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? 'image/${match[1]}' : 'image';
      type = 'application/octet-stream';
      frm.append('photo', { uri: localUri, name: filename, type });
      apiPicUpdate(session.token, frm)
      .then((res) => {
        //   console.log('token', session.token);
        if( res.status !== 200 )
        {
          setPreload({visible:false});
          Alert.alert("Image upload error", res.message, [{text:"Okay"}]);
          return
        }
        apiUserInfo(session.token)
        .then( async (useres) => {
          if( useres.status === 200 )
          {
            await AsyncStorage.setItem(configs.secret, JSON.stringify(useres.payload));
            setUpdateVal(!updateVal);
            setPreload({visible:false});
            return;
          }
          setPreload({visible:false});
          Alert.alert("Image upload error", useres.message, [{text:"Okay"}]);
          return;
        })
        .catch((usererror) => {
          setPreload({visible:false});
          Alert.alert("Image upload error", 'No internet reach', [{text:"Okay"}]);
          return
        });
        setPreload({visible:false});
      })
      .catch((error) => {
        setPreload({visible:false});
        Alert.alert("Image upload error", 'No internet reach', [{text:"Okay"}]);
        return
      });
    }
  };
  const saveHandler = () => {
      console.log(data);
      if(
          data.check_fnameInputChange === true &&
          data.check_lnameInputChange === true &&
        //   data.check_emailInputChange === true &&
          data.check_phoneInputChange === true 
      )
      {
        setPreload({visible:true});
        apiUpdateInfo(session.token, data)
        .then( async (userupdate) => {
            if( userupdate.status === 200 )
            {
                await AsyncStorage.setItem(configs.secret, JSON.stringify(userupdate.payload));
                setUpdateVal(!updateVal);
                setPreload({visible:false});
                return;
            }
            setPreload({visible:false});
            Alert.alert("Account update error", userupdate.message, [{text:"Try again"}]);
            return;
        })
        .catch((uerror) => {
            setPreload({visible:false});
            Alert.alert("Connection error", 'No internet reach', [{text:"Okay"}]);
            return;
        });
      }else
      {
        Alert.alert("Form error", 'Data not set. Fill in all fields', [{text:"Okay"}]);
        return;
      }
  }
  const addressInputChange = (val) => {
    setAddressData({
        ...addressdata,
        address: val,
    });
  };
  const cityInputChange = (val) => {
    setAddressData({
        ...addressdata,
        city: val,
    });
  };
  const stateInputChange = (val) => {
    setAddressData({
        ...addressdata,
        state: val,
    });
  };
  const zipInputChange = (val) => {
    setAddressData({
        ...addressdata,
        zip: val,
    });
  };
  const deleteAddress = (id) => {
      setPreload({visible:true});
    apiDeleteAddress(session.token, id)
    .then((res) => {
        if(res.status === 200 )
        {
            setUpdateVal(!updateVal);
            setPreload({visible:false});
            return;
        }
        setPreload({visible:false});
        return;
    })
    .catch((err) => {
        setPreload({visible:false});
    });
  }
  const hasLenObj = (obj) =>{
      if( obj === undefined )
          return false;
      if( Object.keys(obj).length > 0 )
        return true
    return false;
  }
  const addAddressHandler = () => {
      if( 
          addressdata.address.length >= 10  &&
          addressdata.city.length > 2 &&
          addressdata.state.length >= 2 &&
          addressdata.zip.length >= 5 &&
          addressdata.zip.length <= 6
        )
        {
            setAddressModal(false);
            apiAddAddress(session.token, addressdata)
            .then((resp) => {
                if( resp.status === 200 )
                {
                    setUpdateVal(!updateVal);
                    setPreload({visible:false});
                    setAddressData({address: "",city: "",state: "",zip: "",});
                    return;
                }
                setPreload({visible:false});
                Alert.alert("Address creation error", resp.message, [{text:"Try again"}]);
                return;
            })
            .catch((errr) => {
                setPreload({visible:false});
                Alert.alert("Connection error", 'No internet reach', [{text:"Try again"}]);
                return;
            });
        }
  }
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      // signOut();
      async function isConnectedDevice() {
        await Network.getNetworkStateAsync()
          .then((netstat) => {
            if(!netstat.isInternetReachable)
            {
              Alert.alert('Connection', 'Connection error, check your data',[{text:'Okay'}]);
              // return;
            }
            setPreload({visible:true});
            AsyncStorage.getItem(configs.secret)
            .then((profile_data) => {
              profile_data = JSON.parse(profile_data);
              let xtoken = profile_data.token;
              setSession({token: xtoken });
              setData({
                  ...data,
                  fname:profile_data.fname,
                  lname:profile_data.lname,
                  email:profile_data.email,
                  phone:profile_data.phone
              });
              setProfile(profile_data);
              apiGetAddress(xtoken).then((placeres) =>{
                  console.log('places', placeres);
                  setPlaces(placeres.payload);
              }).catch((placerror) => {
                  console.log(placerror);
              });
              setPreload({visible:false});
            }).catch((xerror) => {
              console.log('profile data error', xerror);
              setPreload({visible:false});
            });
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
    }, [updateVal])
  );
  React.useEffect(() => {
    AppState.addEventListener('change', forceUpdate);
    return () => AppState.removeEventListener('change', forceUpdate);
  }, [updateVal]);
  const forceUpdate = newState => {
    console.log('state', newState);
    setUpdateVal(!updateVal);
    if (newState === 'active')
      setUpdateVal(!updateVal); // forces a rerender
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <Animatable.View animation="fadeInUpBig" duration={500} style={styles.footer}>
          <View style={styles.parentView}>
            <LinearGradient 
              style={[styles.stickyView, {justifyContent:"center", alignItems:"center"}]}
              start={[2,3]}
              end={[0,2]}
              colors={[
                colors.primary,
                colors.primary,
                colors.primary,
                colors.primary,
                colors.primary,
                colors.secondary,
                colors.secondary,
                ]}>
              <View style={{marginTop:5}}>
                <TouchableOpacity onPress={() => pickImage()}>
                  <Image source={{uri:profile.pic}} style={styles.imageView} ></Image>
                </TouchableOpacity>
              </View>
              <Text style={styles.topTitle}>{fUpper(profile.fname) + " " + fUpper(profile.lname)}</Text>
              <View style={styles.shareContainer}>
                <TouchableOpacity style={styles.shareHolder}
                onPress = {() => onShare() }>
                  <MIcon name="share-variant" size={20} color={colors.white}>
                  </MIcon>
                  <Text style={styles.Share}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareHolder}
                onPress={() => signOut() }>
                  <MIcon name="power-standby" size={20} 
                  color={colors.white}>
                  </MIcon>
                  <Text style={styles.Share}>Sign out</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
            <View style={[styles.stickyView, styles.stickyViewBottom, {flex:9}]}>
              <ScrollView>
                <View style={[styles.faqContainer, {flexDirection:"row"}]}>
                  <View style={{flex:1}}>
                    {/* form */}
                    <Text style={styles.label}>First name</Text>
                    <View style={styles.action}>
                        <TextInput
                        placeholder=""
                        value={data.fname}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => fnameInputChange(val)}
                        />
                    </View>
                    {data.check_fnameInputChange === false && (
                        <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Invalid first name</Text>
                        </Animatable.View>
                    )}
                    {/* Lname */}
                    <Text style={styles.label}>Last name</Text>
                    <View style={styles.action}>
                        <TextInput
                        placeholder=""
                        value={data.lname}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => lnameInputChange(val)}
                        />
                    </View>
                    {data.check_lnameInputChange === false && (
                        <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Invalid last name</Text>
                        </Animatable.View>
                    )}
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.action}>
                        <TextInput
                        placeholder=""
                        value={data.email}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => emailInputChange(val)}
                        />
                    </View>
                    {data.check_emailInputChange === false && (
                        <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Invalid email</Text>
                        </Animatable.View>
                    )}
                    {/* phone */}
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.action}>
                        <TextInput
                        placeholder=""
                        value={data.phone}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => phoneInputChange(val)}
                        />
                    </View>
                    {data.check_phoneInputChange === false && (
                        <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Invalid phone</Text>
                        </Animatable.View>
                    )}
                    <Text style={styles.label}>Main address</Text>
                    <View style={styles.action}>
                        <TextInput
                        placeholder=""
                        value={profile.address+' '+profile.state+' '+profile.city+', '+profile.zip}
                        style={[styles.textInput,{backgroundColor:colors.white_dark, borderColor:colors.black_light}]}
                        autoCapitalize="none"
                        editable={false}
                        />
                    </View>
                    {/* add addresses here */}
                    <View style={[styles.btnLinks,{marginTop:1,marginBottom:-5}]}>
                        <TouchableOpacity onPress={() => setAddressModal(true) }>
                            <Text style={{ color: colors.primary, margin: 0 }}>Add address</Text>
                        </TouchableOpacity>
                    </View>
                    {/* list of address with delete opts */}
                    { hasLenObj(places) === true && (
                        <View style={styles.placeContainer}>
                            <View>
                                <Text style={styles.placeTitle}>
                                Other addresses
                                </Text>
                            </View>
                            {places.map((pl, k) => (
                                <View key={k} style={{flexDirection:"row", borderBottomWidth:1, borderBottomColor:colors.ef}}>
                                    <View style={[styles.placeItem, {flex:5}]}>
                                        <Text style={styles.line}>
                                            {pl.address} {""}
                                            {pl.city} {""}
                                            {pl.state} {""}
                                            {pl.zip} {""}
                                        </Text>
                                    </View>
                                    <View style={styles.placeItem}>
                                        <TouchableOpacity 
                                        onPress={() => deleteAddress(pl.id) }>
                                            <Icon name="ios-close-circle" size={25} color={colors.red}></Icon>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                    {/* end list */}
                    {/* btn */}
                    <View style={styles.button}>
                        <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => {
                            saveHandler();
                        }}
                        >
                        <LinearGradient
                            colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                            style={styles.signIn}
                        >
                            <Text style={styles.btnText}>
                                Save Changes
                            </Text>
                        </LinearGradient>
                        </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {/* ADDRESS MODAL */}
                <Modal animationIn="slideInUp" animationInTiming={1000} isVisible={addresmodal}>
                    <View style={styles.modalContainerC}>
                        <View style={{alignItems:"center", marginTop:-10, alignContent:"center"}}>
                            <Icon.Button name="ios-close-circle" size={30} color={colors.secondary} backgroundColor={colors.white} style={{paddingVertical:10}} onPress={() => setAddressModal(false)}></Icon.Button>
                        </View>
                        <View style={{flex:1}}>
                        <View style={[styles.inputContainer, {justifyContent:"center",flexDirection:"column", marginBottom:0}]}>
                        </View>
                            {/* address */}
                            <Text style={[styles.label,{marginBottom:1, marginTop:15}]}>Address</Text>
                            <View style={[styles.action,{marginTop:3}]}>
                            <TextInput
                                value={addressdata.address}
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => addressInputChange(val)}
                            />
                            </View>
                            {/* city */}
                            <Text style={[styles.label,{marginBottom:1}]}>City</Text>
                            <View style={[styles.action,{marginTop:3}]}>
                            <TextInput
                                placeholder=""
                                value={addressdata.city}
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => cityInputChange(val)}
                            />
                            </View>
                            {/* state zip */}
                            <View style={{flexDirection:"row"}}>
                            <View style={{flex:1, marginRight:10,}}>
                                {/* usd */}
                                <Text style={[styles.label,{marginBottom:1}]}>State</Text>
                                <View style={[styles.action,{marginTop:3}]}>
                                <TextInput
                                    placeholder=""
                                    value={addressdata.state}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={(val) => stateInputChange(val)}
                                />
                                </View>
                            </View>
                            <View style={{flex:1, marginLeft:10,}}>
                                {/* kes */}
                                <Text style={[styles.label,{marginBottom:1}]}>Zip code</Text>
                                <View style={[styles.action,{marginTop:3}]}>
                                <TextInput
                                    placeholder=""
                                    value={addressdata.zip}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    maxLength={6}
                                    keyboardType="numeric"
                                    onChangeText={(val) => zipInputChange(val)}
                                />
                                </View>
                            </View>
                            </View>
                            <View style={styles.button}>
                            <TouchableOpacity
                                style={styles.signIn}
                                onPress={() => {
                                addAddressHandler();
                                }}
                            >
                                <LinearGradient
                                colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                                style={styles.signIn}
                                >
                                <Text style={styles.btnText}>Add address</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
              </ScrollView>
            </View>
            {/* footer */}
            <View style={styles.footNav}>
              <TouchableOpacity style={styles.footItem}
              onPress={() => navigation.navigate('AppHome', { screen: 'EntryPoint' }) }
              >
                <Icon name="ios-paper-plane" size={30} color={colors.menu_inactive}></Icon>
                <Text style={styles.footText}>Send money</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.footItem}
              onPress={() => navigation.navigate('AppHome', { screen: 'Activity' }) }
              >
                <Icon name="ios-stats" size={30} color={colors.menu_inactive}></Icon>
                <Text style={styles.footText}>My activities</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.footItem}
              onPress={() => navigation.navigate('AppHome', { screen: 'Support' }) }
              >
                <Icon name="ios-headset" size={30} color={colors.menu_inactive}></Icon>
                <Text style={styles.footText}>Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
        {/* activity indicator */}
        { preload.visible === true && (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.primary_dark} animating={preload.visible} size="large" />
            </View>
        )}
          {/* end indicator */}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  placeContainer:{
    flex:1,
    flexDirection:"column",
    marginLeft:10,
    marginRight:10,
  },
  placeItem:{
      flex:1,
      justifyContent:"center"
  },
  line:{
      paddingBottom:4,
      marginTop:10,
      color:colors.grey,
  },
  placeTitle:{
      color:colors.menu_inactive,
      textAlign:"left",
      marginBottom:5,
  },
  footer: {
    flex: 1,
    backgroundColor: colors.white,
    // marginTop:Constants.statusBarHeight*.5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    // paddingHorizontal: 20,
    // paddingVertical: 5,
  },
  imageView:{
    backgroundColor:colors.white,
    width:100,
    height:100,
    borderRadius:100,
  },
  shareContainer:{
    flex:1,
    flexDirection:"row",
    marginTop:10,
  },
  shareHolder:{
    marginRight:20,
    marginLeft:20,
    flexDirection:"row"
  },
  Share:{
    fontWeight:"500",
    fontSize:18,
    marginLeft:5,
    color:colors.white,
  },
  accountItemTitle:{
    fontWeight:"500",
    fontSize:16,
    marginLeft:5,
    color:colors.black_light,
    top:5
  },
  footItem:{
    flex:1,
    alignItems:"center",
  },
  footText:{
    fontSize:12,
    fontWeight:"500",
    color:colors.menu_inactive,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 0,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 0,
  },
  parentView:{
    flex:1,
  },
  footNav:{
    flex:2,
    paddingTop:6,
    backgroundColor: colors.primary_darker,
    flexDirection:"row",
  },
  topTitle:{
    fontWeight:"700",
    fontSize:18,
    marginTop:5,
    color:colors.white,
  },
  topHeading:{
    fontWeight:"bold",
    fontSize:22,
    color:colors.white,
  },
  stickyView:{
    flex:5,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  stickyViewBottom:{
    paddingTop:15
  },
  faqTitle:{
    color: colors.secondary,
    fontSize: 17,
    fontWeight:"800",
    textAlign:"center",
  },
  faqContainer:{
    borderBottomWidth:1,
    flex:1,
    borderBottomColor:colors.ef,
    marginBottom:15,
    paddingBottom:5,
  },
  btnText:{
    color:colors.white,
    fontWeight:"700",
    fontSize:22,
  },
  fQuestion:{
    fontSize:16,
    color:colors.dark,
  },
  fAnswer:{
    fontSize:16,
    color:colors.black_light,
  },
  
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
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
    borderColor:colors.primary_darker,
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
    justifyContent:"flex-end",
    textDecorationColor: colors.secondary
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
  modalContainerC:{
    backgroundColor: colors.white,
    flex:1,
    flexDirection:"column",
    padding:20,
    borderRadius:40,
    maxHeight:Dimensions.get('screen').height*0.65,
  },
});

export default PersonalInfoScreen;
