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
  AppState,
  Switch,
  Share,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import * as Network from 'expo-network';
import { useTheme } from "@react-navigation/native";
import { AuthContext } from "../components/context";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import colors from "../config/colors";
import Icon from "react-native-vector-icons/Ionicons";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import configs from "../config/configs";
import * as LocalAuthentication from 'expo-local-authentication';
import { apiPicUpdate, apiUserInfo,apiGetPref,apiEditPref } from "../utils/network";
/**  icons */

function NotificationScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  const theme = useTheme();
  const [preload, setPreload] = React.useState({ visible: false });
  const [session, setSession] = React.useState({ token: null});
  const [updateVal, setUpdateVal] = React.useState(false);
  const [profile, setProfile] = React.useState([]);
  const [pref_news, setPrefNews] = React.useState(false);
  const [pref_tran, setPrefTran] = React.useState(false);
  const [pref_exp, setPrefExp] = React.useState(false);
  const [pref_failed, setPrefFailed] = React.useState(false);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitchA = () => {
    if(session.token === null )
    {
      return;
    }
    // console.log('newsres', pref_news);
    let opt = 0;
    setPrefNews(!pref_news);
    if(!pref_news){opt = 1;}
    let postData = { opt:opt, case:"news" };
    setPreload({visible:true});
    apiEditPref(session.token, postData)
    .then((newsres) => {
      // console.log('newsres', postData);
      if(newsres.status === 200 )
      {
        setUpdateVal(!updateVal);
        Alert.alert('Action message', newsres.message,[{text:'Okay'}]);
        setPreload({visible:false});
        return;
      }
      setPreload({visible:false});
      Alert.alert('Action warning', newsres.message,[{text:'Okay'}]);
      return;
    }).catch((newserror) => {
      setPreload({visible:false});
      Alert.alert('Connection error', 'No internet reach',[{text:'Okay'}]);
      return;
    });
  }
  const toggleSwitchB = () => {
    if(session.token === null )
    {
      return;
    }
    // console.log('tranres', pref_tran);
    let opt = 0;
    setPrefTran(!pref_tran);
    if(!pref_tran){opt = 1;}
    let postData = { opt:opt, case:"tran"};
    setPreload({visible:true});
    apiEditPref(session.token, postData)
    .then((tranres) => {
      // console.log('tranres', postData);
      if(tranres.status === 200 )
      {
        setUpdateVal(!updateVal);
        Alert.alert('Action message', tranres.message,[{text:'Okay'}]);
        setPreload({visible:false});
        return;
      }
      setPreload({visible:false});
      Alert.alert('Action warning', tranres.message,[{text:'Okay'}]);
      return;
    }).catch((newserror) => {
      setPreload({visible:false});
      Alert.alert('Connection error', 'No internet reach',[{text:'Okay'}]);
      return;
    });
  }
  const toggleSwitchC = () => {
    if(session.token === null )
    {
      return;
    }
    // console.log('expres', pref_exp);
    let opt = 0;
    setPrefExp(!pref_exp);
    if(!pref_exp){opt = 1;}
    let postData = { opt:opt, case:"expiry"};
    setPreload({visible:true});
    apiEditPref(session.token, postData)
    .then((expres) => {
      // console.log('expres', postData);
      if(expres.status === 200 )
      {
        setUpdateVal(!updateVal);
        Alert.alert('Action message', expres.message,[{text:'Okay'}]);
        setPreload({visible:false});
        return;
      }
      setPreload({visible:false});
      Alert.alert('Action warning', expres.message,[{text:'Okay'}]);
      return;
    }).catch((newserror) => {
      setPreload({visible:false});
      Alert.alert('Connection error', 'No internet reach',[{text:'Okay'}]);
      return;
    });
  }
  const toggleSwitchD = () => {
    if(session.token === null )
    {
      return;
    }
    console.log('failres', pref_failed);
    let opt = 0;
    setPrefFailed(!pref_failed);
    if(!pref_failed){opt = 1;}
    let postData = { opt:opt, case:"failed_tran"};
    setPreload({visible:true});
    apiEditPref(session.token, postData)
    .then((failres) => {
      console.log('failres', postData);
      if(failres.status === 200 )
      {
        setUpdateVal(!updateVal);
        Alert.alert('Action message', failres.message,[{text:'Okay'}]);
        setPreload({visible:false});
        return;
      }
      setPreload({visible:false});
      Alert.alert('Action warning', failres.message,[{text:'Okay'}]);
      return;
    }).catch((newserror) => {
      setPreload({visible:false});
      Alert.alert('Connection error', 'No internet reach',[{text:'Okay'}]);
      return;
    });
  }
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
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
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
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      // signOut();
      async function isConnectedDevice() {
        let xtoken;
        await Network.getNetworkStateAsync()
          .then((netstat) => {
            setPreload({visible:true});
            AsyncStorage.getItem(configs.secret)
            .then((profile_data) => {
              profile_data = JSON.parse(profile_data);
              xtoken = profile_data.token;
              setSession({...session, token: xtoken });
              setProfile(profile_data);
              /** notifications */
              apiGetPref(xtoken)
                .then((prefdata) => {
                    // console.log('prefdata', prefdata.payload);
                    if(prefdata.payload.news === 1) {
                        setPrefNews(true);
                    }else{
                        setPrefNews(false);
                    }
                    if(prefdata.payload.tran === 1) {
                        setPrefTran(true);
                    }else{
                        setPrefTran(false);
                    }
                    if(prefdata.payload.expiry === 1) {
                        setPrefExp(true);
                    }else{
                        setPrefExp(false);
                    }
                    if(prefdata.payload.failed_tran === 1) {
                        setPrefFailed(true);
                    }else{
                        setPrefFailed(false);
                    }
                })
                .catch((preferror) => {
                    console.log('pref error', preferror);
                    Alert.alert('Connection warning', 'Network service error occured',[{text:'Okay'}]);
                });
              /** end notifications */
              setPreload({visible:false});
            }).catch((xerror) => {
              console.log('profile data error', xerror);
              setPreload({visible:false});
            });
            if(!netstat.isInternetReachable)
            {
              Alert.alert('Connection', 'Connection error, check your data',[{text:'Okay'}]);
              // return;
            }
            else{
                
            }
            
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
      <StatusBar backgroundColor={colors.primary_darker} barStyle="light-content" />
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
                {/* newsletter */}
                <View style={[styles.faqContainer, {flexDirection:"row"}]}>
                    <View style={{flex:5}}>
                        <Text style={styles.accountItemTitle}>
                            Receive monthily newsletter via email
                        </Text>
                    </View>
                    <View style={{flex:1}}>
                    <Switch
                        trackColor={{ false: colors.ef, true: colors.secondary }}
                        thumbColor={pref_news ? colors.white : colors.white}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchA}
                        value={pref_news}
                        style={{transform: [{ scaleX: .8 }, { scaleY: .8 }]}}
                    />
                  </View>
                </View>
                {/* transaction */}
                <View style={[styles.faqContainer, {flexDirection:"row"}]}>
                    <View style={{flex:5}}>
                        <Text style={styles.accountItemTitle}>
                            Email me after each transaction
                        </Text>
                    </View>
                    <View style={{flex:1}}>
                    <Switch
                        trackColor={{ false: colors.ef, true: colors.secondary }}
                        thumbColor={pref_tran ? colors.white : colors.white}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchB}
                        value={pref_tran}
                        style={{transform: [{ scaleX: .8 }, { scaleY: .8 }]}}
                    />
                  </View>
                </View>
                {/* expiry */}
                <View style={[styles.faqContainer, {flexDirection:"row"}]}>
                    <View style={{flex:5}}>
                        <Text style={styles.accountItemTitle}>
                            Email me when my credit card is nearing expiry
                        </Text>
                    </View>
                    <View style={{flex:1}}>
                    <Switch
                        trackColor={{ false: colors.ef, true: colors.secondary }}
                        thumbColor={pref_exp ? colors.white : colors.white}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchC}
                        value={pref_exp}
                        style={{transform: [{ scaleX: .8 }, { scaleY: .8 }]}}
                    />
                  </View>
                </View>
                <View style={[styles.faqContainer, {flexDirection:"row"}]}>
                    <View style={{flex:5}}>
                        <Text style={styles.accountItemTitle}>
                            Email me on failed transactions
                        </Text>
                    </View>
                    <View style={{flex:1}}>
                    <Switch
                        trackColor={{ false: colors.ef, true: colors.secondary }}
                        thumbColor={pref_failed ? colors.white : colors.white}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchD}
                        value={pref_failed}
                        style={{transform: [{ scaleX: .8 }, { scaleY: .8 }]}}
                    />
                  </View>
                </View>
                
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
    width:70,
    height:70,
    borderRadius:70,
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
});

export default NotificationScreen;
