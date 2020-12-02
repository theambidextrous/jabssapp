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
import { apiPicUpdate, apiUserInfo } from "../utils/network";
/**  icons */

function SecurityScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  const theme = useTheme();
  const [preload, setPreload] = React.useState({ visible: false });
  const [session, setSession] = React.useState({ token: null});
  const [updateVal, setUpdateVal] = React.useState(false);
  const [profile, setProfile] = React.useState([]);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => {
    if(!isEnabled)
    {
        LocalAuthentication.hasHardwareAsync()
        .then((hasHardware) => {
            if(hasHardware)
            {
                console.log('hasHardware', hasHardware);
                LocalAuthentication.supportedAuthenticationTypesAsync()
                .then((authTypes) => {
                    console.log('types', authTypes[0]);
                    if(authTypes[0] === 1)
                    {
                        LocalAuthentication.isEnrolledAsync()
                        .then((isEnrolled) => {
                            console.log('enrolled', isEnrolled);
                            let offlineAuth = {
                                email:profile.email,
                                token:session.token
                            };
                            console.log('offlineAuth', offlineAuth);
                            if(isEnrolled)
                            {
                                AsyncStorage.setItem('offlineAuth', JSON.stringify(offlineAuth)).then((svd) => {
                                    setIsEnabled(true);
                                    Alert.alert('TouchID Enabled', 'TouchID authentication enabled.',[{text:'Okay'}]);
                                    return;
                                }).catch((svdError) => {
                                    setIsEnabled(false);
                                    return;
                                });
                            }
                            else
                            {
                                Alert.alert('TouchID Error', 'Please enable Touch ID on your phone first.',[{text:'Okay'}]);
                                setIsEnabled(false);
                                return;
                            }
                        })
                    }
                    else
                    {
                        Alert.alert('TouchID Error', 'Your phone does not support TouchID',[{text:'Okay'}]);
                        setIsEnabled(false);
                        return;
                    }
                }).catch((typesError) =>{
                    setIsEnabled(false);
                    Alert.alert('TouchID Warning', 'Authentication failed.',[{text:'Okay'}]);
                    return;
                });
            }
            else
            {
                Alert.alert('Hardware Error', 'Your phone does not support TouchID or FaceID login',[{text:'Okay'}]);
                setIsEnabled(false);
                return;
            }
        })
        .catch((hardwareError) => {
            setIsEnabled(false);
            Alert.alert('Hardware Failed', 'Your phone does not support TouchID or FaceID login',[{text:'Okay'}]);
            return;
        });
    }
    else
    {
        /** remove any auth dt */
        AsyncStorage.removeItem('offlineAuth').then((svd) => {
            setIsEnabled(false);
            Alert.alert('TouchID disabled', 'TouchID authentication disabled.',[{text:'Okay'}]);
            return;
        }).catch((svdError) => {
            setIsEnabled(true);
            Alert.alert('TouchID Error', 'TouchID authentication could not be disabled.',[{text:'Okay'}]);
            return;
        });
        return;
    }
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
              setSession({...session, token: xtoken });
              setProfile(profile_data);
              setPreload({visible:false});
            }).catch((xerror) => {
              console.log('profile data error', xerror);
              setPreload({visible:false});
            });
            AsyncStorage.getItem('offlineAuth').then((offlineAuth) =>{
                let touchID = JSON.parse(offlineAuth);
                if(touchID !== null )
                  if( touchID.email !== undefined && validateEmail(touchID.email) && touchID.token !== undefined && touchID.token.length > 100 ){
                      setIsEnabled(true);
                  }
            }).catch((eff) => { console.log(eff)} );
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
                    <View style={{flex:5}}>
                        <Text style={styles.accountItemTitle}>Enable Touch ID</Text>
                    </View>
                    <View style={{flex:1}}>
                    <Switch
                        trackColor={{ false: colors.ef, true: colors.secondary }}
                        thumbColor={isEnabled ? colors.white : colors.white}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
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

export default SecurityScreen;
