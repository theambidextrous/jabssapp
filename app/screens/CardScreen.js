import React from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  TouchableHighlight,
  TextInput,
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
import Modal from 'react-native-modal';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import colors from "../config/colors";
import Icon from "react-native-vector-icons/Ionicons";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import configs from "../config/configs";
import { CheckBox } from 'react-native-elements';
import * as LocalAuthentication from 'expo-local-authentication';
import { apiPicUpdate, apiUserInfo,apiGetCards, apiEditCard, apiAddCard, enc, dec, apiGetCard, apiDelCard,} from "../utils/network";
/**  icons */

function CardScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  const theme = useTheme();
  const [preload, setPreload] = React.useState({ visible: false });
  const [session, setSession] = React.useState({ token: null});
  const [updateVal, setUpdateVal] = React.useState(false);
  const [profile, setProfile] = React.useState([]);
  const [ccards, setCcards] = React.useState([]);
  const [addccmodal, toggleAddCc] = React.useState(false);
  const [editccmodal, toggleEditCc] = React.useState(false);
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
  const [editcarddata, setEditCardData] = React.useState({ 
    cardid:null,
    isdefault:false,
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
  /** check if user is still active */
  const initCardHandler = () => {
      toggleAddCc(true);
  }
  const initEditCardHandler = (id) => {
    setPreload({visible:true});
    apiGetCard(session.token, id)
    .then((eres) => {
      if(eres.status === 200 )
      {
        let info = eres.payload;
        setEditCardData({
          ...editcarddata,
          cardid:id,
          cardname:info.cardname,
          pan:info.mask,
          exp:dec(info.exp),
          isvalidcardname:true,
          isvalidpan:false,
          isvalidexp:true,
          isvalidfingerprint:false
        });
        setPreload({visible:false});
        toggleEditCc(true);
        return;
      }
      Alert.alert(
        'Edit card error', 
        eres.message,
        [{
          text:'Try again', 
        }]
      );
      setPreload({visible:false});
      return;
    })
    .catch((eerror) => {
      Alert.alert(
        'Edit card error', 
        'No internet reach',
        [{
          text:'Try again', 
        }]
      );
      setPreload({visible:false});
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
    apiAddCard(session.token, postData)
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
        setPreload({visible:false});
        Alert.alert(
          'Card Message', 
          acard.message,
          [{
            text:'Okay', 
            onPress:() => {
                clearcard();
                toggleAddCc(false);
                setUpdateVal(!updateVal);
            },
          }]
        );
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
  /** ====edit card funcs */
  const ecardnameInputChange = (val) => {
    if ( val.length >= 5 ) {
      setEditCardData({
        ...editcarddata,
        cardname: val,
        isvalidcardname:true
      });
    } else {
      setEditCardData({
        ...editcarddata,
        cardname: val,
        isvalidcardname:false
      });
    }
  };
  const ecardInputChange = (val) => {
    if ( val.length >= 13 ) {
      setEditCardData({
        ...editcarddata,
        pan: val,
        isvalidpan:true
      });
    } else {
      setEditCardData({
        ...editcarddata,
        pan: val,
        isvalidpan:false
      });
    }
  };
  const eexpInputChange = (val) => {
    if ( val.length <= 5 ) {
      setEditCardData({
        ...editcarddata,
        exp:validateexp(val),
        isvalidexp:true,
      });
    }else
    {
      setEditCardData({
        ...editcarddata,
        exp:validateexp(val),
        isvalidexp:false,
      });
    }
  };
  const ecvvInputChange = (val) => {
    if ( val.length > 3 ) {
      setEditCardData({
        ...editcarddata,
        fingerprint:carddata.fingerprint,
        isvalidfingerprint:true,
      });
      return;
    }
    if ( val.length === 3 ) {
      setEditCardData({
        ...editcarddata,
        fingerprint:val,
        isvalidfingerprint:true,
      });
    }else
    {
      setEditCardData({
        ...editcarddata,
        fingerprint:val,
        isvalidfingerprint:false,
      });
    }
  };
  const editCardHandler = () => {
    let id = editcarddata.cardid;
    setPreload({visible: true});
    let panlength = editcarddata.pan.length;
    let mask = '********' + editcarddata.pan.substr(panlength - 4);
    let postData ={
      cardname:editcarddata.cardname,
      isdefault:editcarddata.isdefault,
      mask:mask,
      pan:enc(editcarddata.pan),
      exp:enc(editcarddata.exp),
      fingerprint:enc(editcarddata.fingerprint),
      pciprint:enc(editcarddata.cardname+editcarddata.exp),
    };
    apiEditCard(session.token, postData, id)
    .then((ecard) => {
      console.log('card edit', ecard);
      if( ecard.status !== 200 )
      {
        Alert.alert(
          'Card Error', 
          ecard.message,
          [{
            text:'Try again', 
          }]
        );
        setPreload({visible:false});
        return;
      }else
      {
        setPreload({visible:false});
        Alert.alert(
          'Card Message', 
          ecard.message,
          [{
            text:'Okay', 
            onPress:() => {
              toggleEditCc(false);
              setUpdateVal(!updateVal);
            },
          }]
        );
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
  const initDeleteCardHandler = () => {
    Alert.alert(
      'Confirm action', 
      'Are you sure you want to delete this card?',
      [
        {text:'No'},
        {
          text:'Yes',
          onPress:() => deleteCardHandler(),
        }
      ]
    );
  }
  const deleteCardHandler = () => {
    setPreload({visible:true});
    apiDelCard(session.token, editcarddata.cardid)
    .then((delres) => {
      if(delres.status === 200 )
      {
        setPreload({visible:false});
        toggleEditCc(false);
        setUpdateVal(!updateVal);
        return;
      }
      Alert.alert(
        'Deletion error', 
        delres.message,
        [{
          text:'Okay', 
        }]
      );
      setPreload({visible:false});
      return;
    })
    .catch((delerror) => {
      Alert.alert(
        'Connection error', 
        'No internet reach. Try gain later',
        [{
          text:'Okay', 
        }]
      );
      setPreload({visible:false});
      return;
    });
  }
  /** end edit card funcs */
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
  const hasLenObj = (obj) =>{
    if( obj === undefined )
        return false;
    if( Object.keys(obj).length > 0 )
      return true
  return false;
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
            setPreload({visible:true});
            AsyncStorage.getItem(configs.secret)
            .then((profile_data) => {
              profile_data = JSON.parse(profile_data);
              let xtoken = profile_data.token;
              setSession({...session, token: xtoken });
              setProfile(profile_data);
              setPreload({visible:false});
              /** ccs */
              setPreload({visible:true});
                apiGetCards(xtoken)
                .then((cres) => {
                    console.log('cres', cres);
                    if(cres.status === 200 )
                    {
                        setCcards(cres.payload);
                        setPreload({visible:false});
                    }
                })
                .catch((cerror) => {
                    console.log('cerror', cerror);
                    setPreload({visible:false});
                });
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
                {/* cards */}
                { hasLenObj(ccards) && (
                    ccards.map((cc, ky) => (
                    <View key={ky} style={[styles.faqContainer, {flexDirection:"row"}]}>
                        <View style={{flex:2}}>
                            <Image style={styles.ccImage} source={{uri:cc.icon}}></Image>
                        </View>
                        <View style={{flex:6}}>
                            <Text style={styles.accountItemTitle}>
                                {cc.mask}
                            </Text>
                        </View>
                        {cc.isdefault === 1 ? (
                            <View style={{flex:4}}>
                                <View style={{flexDirection:"row"}}>
                                    <Text style={styles.Eye}>Default</Text>
                                    <Switch
                                        trackColor={{ false: colors.ef, true: colors.secondary }}
                                        thumbColor={colors.white}
                                        ios_backgroundColor="#3e3e3e"
                                        value={true}
                                        style={{transform: [{ scaleX: .8 }, { scaleY: .8 }]}}
                                    />
                                </View>
                            </View>
                        ):(
                            <View style={{flex:4}}>
                                <TouchableOpacity onPress={() => initEditCardHandler(cc.id) }>
                                    <Icon style={styles.ccIcon} name="ios-arrow-dropright-circle" size={35} color={colors.secondary}></Icon>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    ))
                )}
                <View style={{flex:1, alignItems:"flex-end"}}>
                    <View style={[styles.button,{width:"60%"}]}>
                        <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => initCardHandler() }>
                            <LinearGradient
                                colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                                style={styles.signIn}>
                                <Text style={styles.btnText}>Add new card</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* end cards */}
                {/* add card MODAL */}
                <Modal animationIn="slideInUp" animationInTiming={800} isVisible={addccmodal}>
                    <View style={styles.modalContainerF}>
                        <View style={{alignItems:"center", marginTop:-10, alignContent:"center"}}>
                            <Icon.Button name="ios-close-circle" size={30} color={colors.secondary} backgroundColor={colors.white} style={{paddingVertical:0}} onPress={() => toggleAddCc(false)}></Icon.Button>
                        </View>
                        <View style={{flex:1, marginTop:-10,}}>
                        <View style={[styles.inputContainer, {justifyContent:"center",flexDirection:"column", marginBottom:0,backgroundColor:"transparent"}]}>
                            <Text style={styles.modalTitle}>
                            Add credit card
                            </Text>
                        </View>
                            {/* card */}
                            <Text style={[styles.label,{marginBottom:1, marginTop:0}]}>Card number</Text>
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
                            <View style={[styles.button,{width:"100%"}]}>
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
                    </View>
                    {/* activity indicator */}
                    { preload.visible === true && (
                        <View style={styles.loading}>
                        <ActivityIndicator color={colors.primary_dark} animating={preload.visible} size="large" />
                        </View>
                    )}
                    {/* end indicator */}
                </Modal>
                {/* edit card MODAL */}
                <Modal animationIn="slideInUp" animationInTiming={800} isVisible={editccmodal}>
                    <View style={styles.modalContainerC}>
                        <View style={{alignItems:"center", marginTop:-10, alignContent:"center"}}>
                            <Icon.Button name="ios-close-circle" size={30} color={colors.secondary} backgroundColor={colors.white} style={{paddingVertical:0}} onPress={() => toggleEditCc(false)}></Icon.Button>
                        </View>
                        <View style={{flex:1, marginTop:-10}}>
                        <View style={[styles.inputContainer, {justifyContent:"center",flexDirection:"column", marginBottom:0, backgroundColor:"transparent"}]}>
                            <Text style={styles.modalTitle}>
                            Edit credit card
                            </Text>
                        </View>
                            {/* card */}
                            <Text style={[styles.label,{marginBottom:1, marginTop:0}]}>Card number</Text>
                            <View style={[styles.action,{marginTop:3}]}>
                            <TextInput
                                value={editcarddata.pan}
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) =>ecardInputChange(val)}
                            />
                            </View>
                            {editcarddata.isvalidpan === false && (
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Invalid card number</Text>
                            </Animatable.View>
                            )}
                            {/* name */}
                            <Text style={[styles.label,{marginBottom:1}]}>Name on card</Text>
                            <View style={[styles.action,{marginTop:3}]}>
                            <TextInput
                                placeholder=""
                                value={editcarddata.cardname}
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => ecardnameInputChange(val)}
                            />
                            </View>
                            {editcarddata.isvalidcardname === false && (
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
                                    value={editcarddata.exp}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={(val) => eexpInputChange(val)}
                                />
                                </View>
                                {editcarddata.isvalidexp === false && (
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
                                    value={editcarddata.fingerprint}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={(val) => ecvvInputChange(val)}
                                />
                                </View>
                                {editcarddata.isvalidfingerprint === false && (
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Invalid value</Text>
                                </Animatable.View>
                                )}
                            </View>
                            </View>
                            <View style={[{justifyContent:"center", alignSelf:"center"}]}>
                                <CheckBox
                                containerStyle={styles.checkContainer}
                                textStyle={styles.checkText}
                                title="Set as default"
                                checked={editcarddata.isdefault}
                                onPress={() =>{
                                  setEditCardData({...editcarddata, isdefault: !editcarddata.isdefault});
                                }}
                                />
                            </View>
                            <View style={{flex:1, flexDirection:"row"}}>
                                <View style={[styles.button,{width:"100%", flex:1, paddingRight:10}]}>
                                    <TouchableOpacity
                                        style={styles.signIn}
                                        onPress={() => {
                                        editCardHandler();
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
                                <View style={[styles.button,{width:"100%", flex:1, paddingLeft:10,}]}>
                                <TouchableOpacity
                                    style={styles.signIn}
                                    onPress={() => {
                                    initDeleteCardHandler();
                                    }}
                                >
                                    <LinearGradient
                                    colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                                    style={styles.signIn}
                                    >
                                    <Text style={styles.btnText}>Delete</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
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
                {/* END ================= */}
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
  ccImage:{
      height:17,
      width:50,
  },
  ccIcon:{
    alignSelf:"flex-end",
    marginRight:10,
  },
  Eye:{
      fontSize:14,
      color:colors.black_light,
      marginRight:5,
      justifyContent:"center",
      alignSelf:"center"
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
    fontSize:18,
    marginLeft:5,
    color:colors.dark,
    top:1
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
  button: {
    alignItems: "center",
    marginTop: 20,
    height:55,
    flex: 1,
    width: "50%",
  },
  signIn: {
    width: "100%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 0,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 0,
  },
  btnText:{
    color:colors.white,
    fontWeight:"700",
    fontSize:22,
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
  modalContainerC:{
    backgroundColor: colors.white,
    flex:1,
    flexDirection:"column",
    padding:20,
    borderRadius:40,
    maxHeight:Dimensions.get('screen').height*0.85,
  },
  modalContainerF:{
    backgroundColor: colors.white,
    flex:1,
    flexDirection:"column",
    padding:20,
    borderRadius:40,
    maxHeight:Dimensions.get('screen').height*0.70,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalTitle:{
    color:colors.secondary,
    textAlign:"center",
    fontWeight:"700",
    fontSize:22,
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
  checkContainer:{
    backgroundColor:colors.white, 
    borderColor:colors.white
  },
  checkText:{
    color:colors.black_light,
    fontSize:18,
    fontWeight:'400',
    marginBottom:0,
  },
});

export default CardScreen;
