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
  StatusBar,
  Alert,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  AppState,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import * as Network from 'expo-network';
import { useTheme } from "@react-navigation/native";
import { AuthContext } from "../components/context";
import { Constants } from "react-native-unimodules";
import Modal from 'react-native-modal';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import colors from "../config/colors";
import Icon from "react-native-vector-icons/Ionicons";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import configs from "../config/configs";
import {dummy} from "../components/dummy";
/**  icons */

function ActivityScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  const theme = useTheme();
  const [preload, setPreload] = React.useState({ visible: false });
  const [session, setSession] = React.useState({ token: null});
  const [updateVal, setUpdateVal] = React.useState(false);
  const [modalvisible, setModalVisible] = React.useState({ mail: false});

  const handleSending = () => {
    return;
  }
  const mailHandler = () => {
    Alert.alert(
      'Email confirmation',
      "Would you like to send this transactions's receipt to your email?",
      [{
        text:'Yes',
        onPress:() => handleSending(),
      },
      {
        text:"No",
      }
    ]);
    return;
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
              setPreload({visible:false});
            }).catch((xerror) => {
              console.log('xtoken error', xerror);
              setPreload({visible:false});
            });
            return;
          })
          .catch((error) => {
            setPreload({visible:false});
            Alert.alert('Connection warning', 'Network service error occured',
            [{text:'Okay'}]);
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
          <ScrollView>
            { dummy.map( (item, key) => (
              <View style={styles.entry} key={key}>
              
                <View style={[styles.entryCol, {flex:4}]}>
                  <Text style={styles.entryColTitle}>{item.to}</Text>
                  <View style={styles.entrySubCol}>
                    <View style={styles.entrySubColItem}>
                      <Text style={styles.entryColp}>{item.rp}</Text>
                    </View>
                    <View style={styles.entrySubColItem}>
                      <Text style={styles.entryColp}>{item.dt}</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.entryCol, {flex:2}]}>
                  <Text style={styles.entryColTitle}>${item.usd}</Text>
                  <View style={styles.entrySubCol}>
                    <View style={styles.entrySubColItem}>
                      <Text style={styles.entryColp}>{item.kes} Ksh</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.entryCol}>
                  <Text style={styles.entryColTitle}>
                    <TouchableOpacity>
                      <MIcon.Button onPress={()=> mailHandler() }
                      backgroundColor={colors.white} name="email-check" size={20} color={colors.goldenrod}></MIcon.Button>
                    </TouchableOpacity>
                  </Text>
                </View>

              </View>
            ))}
            {/* send to mail */}
            <Modal animationIn="slideInUp" animationInTiming={100} isVisible={false}>
              <View style={styles.modalContainer}>
                <View style={{flex:1}}>
                  <View style={[styles.inputContainer, {justifyContent:"center",flexDirection:"column", marginBottom:0}]}>
                    <Text style={styles.modalTitle}>
                      Send to email
                    </Text>
                  </View>
                  <View style={styles.button}>
                    <TouchableOpacity
                      style={styles.signIn}
                      onPress={() => null }
                    >
                      <LinearGradient
                        colors={[colors.primary, colors.primary_dark, colors.primary_darker,colors.primary_darker]}
                        style={styles.signIn}
                      >
                        <Text style={styles.btnText}>Send</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            {/* END ================= */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  entry:{
    borderBottomWidth:1,
    flex:1,
    flexDirection:"row",
    borderBottomColor:colors.ef,
    marginBottom:15,
    paddingBottom:5,
  },
  entryCol:{
    flex:1,
  },
  entryColTitle:{
    fontSize:13,
    fontWeight:"700",
    color:colors.dark,
  },
  entryColp:{
    fontSize:11,
    fontWeight:"600",
    color:colors.black_light,
  },
  entrySubCol:{
    flex:1,
    flexDirection:"row",
  },
  entrySubColItem:{
    flex:1,
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
    borderColor:colors.primary_darker,
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
    maxHeight:Dimensions.get('screen').height*0.70,
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
    maxHeight:Dimensions.get('screen').height*0.60,
  }
});

export default ActivityScreen;
