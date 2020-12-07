import React from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  Alert,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  AppState,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import * as Network from 'expo-network';
import { useTheme } from "@react-navigation/native";
import { AuthContext } from "../components/context";
import { Constants } from "react-native-unimodules";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import RNPickerSelect from 'react-native-picker-select';
import colors from "../config/colors";
import {apiForexMeta, enc, dec, apiHasCard, apiAddCard, apiSend} from "../utils/network";
import Modal from 'react-native-modal';
import configs from "../config/configs";
import Icon from "react-native-vector-icons/Ionicons";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { acc } from "react-native-reanimated";
/**  icons */

function WelcomeScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  const theme = useTheme();
  const [preload, setPreload] = React.useState({ visible: false });
  const [session, setSession] = React.useState({ token: null, trans_fees:'' });
  const [modalvisible, setModalVisible] = React.useState({ card: false, review: false });
  const [review, setReview] = React.useState(false);
  const [forex, setForex] = React.useState({ 
    bill_charge:null,
    market_rate:null,
    applied_rate:'checking...',
    forex_offset:null,
  });
  const [reviewdata, setReviewData] = React.useState({ 
    to:'checking...',
    amt:'checking...',
    note:'checking...',
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
    send_option:'1',
    receiver_phone:'',
    till_paybill:'',
    account_no:'',
    amount_usd:'',
    amount_kes:'',
    notes:'',
    forex_rate: null,
    forex_used:null,
    showmpesaopt:true,
    showtillopt:false,
    isvalidphone:true,
    isvalidtill:true,
    isvalidamtusd:true,
    isvalidaccount:true,
  });
  const [updateVal, setUpdateVal] = React.useState(false);
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
  const handleNaN = (amt) => {
    if(isNaN(amt))
    {
      return 0;
    }
    return amt;
  }
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
  const handleSendOpt = (val) => {
    if( val === '1' )
    {
      setData({
        ...data,
        send_option:val,
        showmpesaopt: true,
        showtillopt: false,
      });
      setSession({...session, trans_fees:''});
      return;
    }else
    {
      setData({
        ...data,
        send_option:val,
        showmpesaopt: false,
        showtillopt: true,
      });
      let fee = parseFloat((forex.bill_charge*parseInt(data.amount_usd))/100);
      fee = parseFloat(fee+parseInt(data.amount_usd)).toFixed(2);
      setSession({...session, trans_fees:fee});
      return;
    }
  }
  const Dropdown = () => {
    return (
        <RNPickerSelect
            onValueChange={(v) => handleSendOpt(v) }
            value={data.send_option}
            style={pickerSelectStyles}
            items={[
                { label: 'Send to mpesa', value: '1' },
                { label: 'Send to till or paybill', value: '2' },
            ]}
            Icon={() => {
              return <Icon size={20} name="ios-arrow-down" color={colors.black} />;
            }}
        />
    );
  };
  const validatePhone = (v) => {
    var phoneno = /^\d{10}$/;
    if( v.match(phoneno) ){
      return true;
    }else{
      return false;
    }
  }
  const phoneInputChange = (val) => {
    if (validatePhone(val)) {
      setData({
        ...data,
        receiver_phone: val,
        isvalidphone: true,
      });
    } else {
      setData({
        ...data,
        receiver_phone: val,
        isvalidphone: false,
      });
    }
  };
  const amountInputChange = (val) => {
    let amt = parseInt(val);
    if ( amt > 0 ) {
      setData({
        ...data,
        amount_usd: amt.toString(),
        amount_kes: parseFloat(Math.round(amt*forex.applied_rate)).toString(),
        isvalidamtusd: true,
      });
      if(data.send_option === '2')
      {
        let fee = parseFloat((forex.bill_charge*parseInt(val))/100);
        fee = parseFloat(fee+parseInt(val)).toFixed(2);
        setSession({...session, trans_fees:fee});
      }
    } else {
      setData({
        ...data,
        amount_usd: val,
        amount_kes: '0',
        isvalidamtusd: false,
      });
      let fee = parseFloat((forex.bill_charge*parseInt(val))/100);
      fee = parseFloat(fee+parseInt(val)).toFixed(2);
      if(isNaN(fee))
        fee = 0;
      setSession({...session, trans_fees:fee});
    }
  };
  const noteInputChange = (val) => {
    setData({
      ...data,
      notes: val,
    });
  };
  const tillInputChange = (val) => {
    let till = parseInt(val);
    if (till.toString().length >= 5 ) {
      setData({
        ...data,
        till_paybill: val,
        isvalidtill: true,
      });
    } else {
      setData({
        ...data,
        till_paybill: val,
        isvalidtill: false,
      });
    }
  };
  const accountInputChange = (val) => {
    if (val.length >= 1 ) {
      setData({
        ...data,
        account_no: val,
        isvalidaccount: true,
      });
    } else {
      setData({
        ...data,
        account_no: val,
        isvalidaccount: false,
      });
    }
  };
  const showHelp = () => {
    Alert.alert(
      'Help Info', 
      'Bill account number is same as the INVOICE number. E.g. if paying college fees, Bill account can be the student admission number',
      [{text:'Got it'}]
    );
  }
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
    setModalVisible({...modalvisible, card:false});
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
  const reviewHandler = () => {
    /** do possible payload validations */
    if( data.send_option === '1')
    {
      setReviewData({
        ...reviewdata,
        to:data.receiver_phone,
        amt:data.amount_kes,
        note:data.notes,
      });
    }else{
      setReviewData({
        ...reviewdata,
        to:data.till_paybill + ' for acc ' + data.account_no,
        amt:data.amount_kes,
        note:data.notes,
      });
    }
    setReview(true);
    return;
  }
  const sendHandler = () => {
    setPreload({visible:true});
    setReview(false);
    apiHasCard(session.token)
    .then((hascc) => {
      console.log('hass data', hascc);
      if( hascc.status !== 200 )
      {
        Alert.alert(
          'Incomplete Account', 
          hascc.message,
          [{
            text:'Add card', 
            onPress: () => setModalVisible({...modalvisible, card:true}),
          }]
        );
        setPreload({visible:false});
        return;
      }else
      {
        /** go on send */
        setData({
          ...data,
          forex_rate:forex.market_rate,
          forex_used: forex.applied_rate,
        });
        apiSend(session.token, data)
        .then((sendres) => {
          console.log('send res', sendres);
          if(sendres.status !== 200 )
          {
            Alert.alert(
              'Send error', 
              sendres.message,
              [{
                text:'Try again', 
              }]
            );
            setPreload({visible:false});
            return;
          }else
          {
            setData({
              ...data,
              send_option:'1',
              receiver_phone:'',
              till_paybill:'',
              account_no:'',
              amount_usd:'',
              amount_kes:'',
              notes:'',
              showmpesaopt:true,
              showtillopt:false,
              isvalidphone:true,
              isvalidtill:true,
              isvalidamtusd:true,
              isvalidaccount:true,
            });
            setSession({...session, trans_fees:''});
            Alert.alert(
              'Transaction was sent', 
              sendres.message,
              [{
                text:'View Transaction', 
              }]
            );
            setPreload({visible:false});
            return;
          }
        })
        .catch((senderror) => {
          console.log('send err', senderror);
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
    })
    .catch((herror) => {
      console.log('has cc err', herror);
      Alert.alert(
        'Network error', 
        'No internet reach',
        [{
          text:'Okay', 
        }]
      );
      setPreload({visible:false});
      return;
    });
  }
  /** check if user is still active */
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
              return;
            }
            setPreload({visible:true});
            AsyncStorage.getItem('userToken')
            .then((xtoken) => {
              setSession({...session, token: xtoken });
              apiForexMeta(xtoken)
              .then((meta) => {
                // console.log('forex err', meta);
                if( meta.status !== 200 )
                {
                  console.log('forex err', meta);
                  Alert.alert(
                    "Forex fetch error",
                    meta.message,
                    [{ text: "Okay" }]
                  );
                  setPreload({visible:false});
                  return;
                }
                setForex({
                  ...forex,
                  bill_charge: meta.payload.bill_charge,
                  market_rate: meta.payload.market_rate,
                  applied_rate: meta.payload.applied_rate,
                  forex_offset: meta.payload.forex_offset,
                });
                setPreload({visible:false});
                return;
              })
              .catch((merror) => {
                console.log('forex fetch error', merror);
                setPreload({visible:false});
                return;
              });
            }).catch((xerror) => {
              console.log('xtoken error', xerror);
            });
            return;
          })
          .catch((error) => {
            Alert.alert('Connection warning', 'Network service error occured',
            [{text:'Okay'}]);
          });
          console.log(forex);
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
        <Animatable.View animation="fadeInUpBig" duration={1} style={styles.footer}>
          <ScrollView>
            {/* options */}
            <Text style={styles.label}>Send options</Text>
            <View>
              <View style={styles.textInput}>
              <Dropdown/>
              </View>
            </View>
            {data.showmpesaopt ? (
              <View>
                <Text style={styles.label}>Recipient number</Text>
                <View style={styles.action}>
                  <TextInput
                    placeholder=""
                    value={data.receiver_phone}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => phoneInputChange(val)}
                  />
                </View>
                {data.isvalidphone === false && (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Invalid phone. Use 0XXXXXXXXX</Text>
                  </Animatable.View>
                )}
              </View>
            ):(
              <View>
                {/* recipient till */}
                <Text style={styles.label}>Till or paybill number</Text>
                <View style={styles.action}>
                  <TextInput
                    placeholder=""
                    value={data.till_paybill}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => tillInputChange(val)}
                  />
                </View>
                {data.isvalidtill === false && (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Invalid till/paybill number</Text>
                  </Animatable.View>
                )}
                {/* bill account number */}
                <View style={{flex:1, flexDirection:"row"}}>
                  <Text style={styles.label}>Bill account number</Text>
                  <Text style={styles.help} onPress={ () => showHelp() }>
                    <MIcon name="help-circle" size={20} color={colors.secondary} />
                  </Text>
                </View>
                <View style={styles.action}>
                  <TextInput
                    placeholder=""
                    value={data.account_no}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => accountInputChange(val)}
                  />
                </View>
                {data.isvalidaccount === false && (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Invalid account number</Text>
                  </Animatable.View>
                )}
              </View>
            )}
            {/* amounts section */}
            <View style={{flexDirection:"row"}}>
              <View style={{flex:1, marginRight:10,}}>
                {/* usd */}
                <Text style={styles.label}>Amount($)</Text>
                <View style={styles.action}>
                  <TextInput
                    placeholder=""
                    value={data.amount_usd}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => amountInputChange(val)}
                  />
                </View>
                <View style={{flex:1}}>
                  <Text style={[styles.termsLink,{fontSize:10}]}>1 USD = {forex.applied_rate}</Text>
                </View>
                {data.isvalidamtusd === false && (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Invalid Amount</Text>
                  </Animatable.View>
                )}
              </View>
              <View style={{flex:1, marginLeft:10,}}>
                {/* kes */}
                <Text style={styles.label}>Receive(Ksh)</Text>
                <View style={styles.action}>
                  <TextInput
                    placeholder=""
                    value={handleNaN(data.amount_kes).toString()}
                    style={[styles.textInput,{backgroundColor:colors.white_dark, borderColor:colors.black_light}]}
                    autoCapitalize="none"
                    editable = {false}
                  />
                </View>
              </View>
            </View>
            <View style={{flexDirection:"row",justifyContent:"center"}}>
              { session.trans_fees.length > 0 && (
                <Text style={styles.debitText}>Debit Amt {"$" + handleNaN(session.trans_fees)}</Text>
              )}
            </View>
            {/* notes */}
            <Text style={styles.label}>Notes</Text>
            <View style={styles.action}>
              <TextInput
                placeholder=""
                value={data.notes}
                style={styles.textInput}
                autoCapitalize="none"
                maxLength={150}
                onChangeText={(val) => noteInputChange(val)}
              />
            </View>
            {/* button */}
            <View style={[styles.button, styles.Last]}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => reviewHandler() }
              >
                <LinearGradient
                  colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                  style={styles.signIn}
                >
                  <Text style={styles.btnText}>
                    Send now
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* add card MODAL */}
            <Modal animationIn="slideInUp" animationInTiming={100} isVisible={modalvisible.card}>
              <ScrollView style={styles.modalContainer}>
                <View style={{flex:1}}>
                  <View style={[styles.inputContainer, {justifyContent:"center",flexDirection:"column", marginBottom:0}]}>
                    <Text style={styles.modalTitle}>
                      Add new card
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

            {/* Review modal */}
            <Modal animationIn="slideInUp" animationInTiming={1000} isVisible={review}>
              <ScrollView style={styles.modalContainerC}>
                <View style={{flex:1}}>
                  <View style={[styles.inputContainer, {justifyContent:"center",flexDirection:"column", marginBottom:0}]}>
                    <Text style={styles.modalTitle}>
                      Review & send
                    </Text>
                  </View>
                    {/* card */}
                    <Text style={styles.info}>Just before we deliver the money, please confirm the information below is correct. Refund won't be possible</Text>
                    <View style={styles.infocontainer}>
                      <Text style={styles.infochild}>To:{" "} 
                        <Text>{reviewdata.to}</Text>
                      </Text>
                      <Text style={styles.infochild}>Receive:{" "} 
                        <Text>Ksh. {reviewdata.amt}</Text>
                      </Text>
                      <Text style={styles.infochild}>Notes:{" "} 
                        <Text>{reviewdata.note}</Text>
                      </Text>
                    </View>
                    <View style={{flex:1, flexDirection:"row"}}>
                      <View style={[styles.button, {marginRight:10,}]}>
                        <TouchableOpacity
                          style={styles.signIn}
                          onPress={() => {
                            sendHandler();
                          }}
                        >
                          <LinearGradient
                            colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                            style={styles.signIn}
                          >
                            <Text style={styles.btnText}>Send</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.button, {marginLeft:10,}]}>
                        <TouchableOpacity
                          style={styles.signIn}
                          onPress={() => setReview(false)}
                        >
                          <LinearGradient
                            colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                            style={styles.signIn}
                          >
                            <Text style={styles.btnText}>Cancel</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>
              </ScrollView>
            </Modal>
          </ScrollView>
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingLeft: 10,
    marginBottom:10,
    borderWidth:0,
    borderColor:colors.primary_darker,
    color: colors.black,
    height:50,
    borderRadius:30,
    textAlign: "center",
    fontSize: 18,
    paddingRight: 30,
  },
  inputAndroid: {
    paddingLeft: 10,
    marginBottom:10,
    borderWidth:1,
    borderColor:colors.primary_darker,
    color: colors.dark,
    height:50,
    borderRadius:30,
    textAlign: "center",
    fontSize: 18,
    paddingRight: 30,
  },
  iconContainer: {
    top: 15,
    right: 15,
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  info:{
    textAlign:"center",
    marginTop:15,
    marginBottom:7,
  },
  infocontainer:{
    backgroundColor:colors.ef,
    minHeight:"40%",
    borderRadius:20,
    justifyContent:"center",
    marginTop:5,
    paddingLeft:20,
    paddingTop:6,
    paddingRight:6,
    paddingBottom:6,
  },
  infochild:{
    color: colors.dark,
    fontWeight:"500",
    fontSize:18,
    marginBottom:5,
  },
  infobaby:{
    paddingLeft:5,
  },
  Last:{
    marginBottom:30,
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
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 0,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 0,
  },
  label: {
    color:colors.black_light,
    fontSize:18,
    fontWeight:'400',
    marginBottom:6,
  },
  termsLink:{
    color:colors.secondary,
    fontSize:12,
    marginLeft:20,
  },
  debitText:{
    color:colors.secondary,
    fontSize:16,
    marginLeft:20,
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
  help:{
    marginLeft:5,
    top:3,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
    textAlign:"center",
  },
  modalTitle:{
    color:colors.secondary,
    textAlign:"center",
    fontWeight:"700",
    fontSize:22,
  },
  btnText:{
    color:colors.white,
    fontWeight:"700",
    fontSize:22,
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
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
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
  modalContainer:{
    backgroundColor: colors.white,
    flex:1,
    flexDirection:"column",
    padding:20,
    borderRadius:40,
    maxHeight:Dimensions.get('screen').height*0.75,
  },
  modalContainerB:{
    backgroundColor: colors.white,
    flex:1,
    flexDirection:"row",
    padding:20,
    borderRadius:40,
    maxHeight:Dimensions.get('screen').height*0.5,
  },
  modalContainerC:{
    backgroundColor: colors.white,
    flex:1,
    flexDirection:"column",
    padding:20,
    borderRadius:40,
    maxHeight:Dimensions.get('screen').height*0.65,
  }
});

export default WelcomeScreen;
