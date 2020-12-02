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
import { List } from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import colors from "../config/colors";
import Icon from "react-native-vector-icons/Ionicons";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import configs from "../config/configs";
import {faq} from "../components/dummy";
import { color } from "react-native-reanimated";
/**  icons */

function SupportScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  const theme = useTheme();
  const [preload, setPreload] = React.useState({ visible: false });
  const [session, setSession] = React.useState({ token: null});
  const [updateVal, setUpdateVal] = React.useState(false);
  const [modalvisible, setModalVisible] = React.useState({ mail: false});
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
            Alert.alert('Connection warning','Network service error occured',
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
          <View style={styles.parentView}>
            {/* <View style={styles.stickyView}>
              
            </View> */}
            <LinearGradient 
              style={[styles.stickyView, {justifyContent:"center", alignItems:"center"}]}
              start={[0,1]}
              end={[1,0]}
              colors={[
                colors.secondary, 
                colors.secondary,
                colors.secondary,
                colors.secondary_dark,
                colors.secondary,
                ]}>
              <Text style={styles.topHeading}>Support Emails</Text>
              <Text style={styles.topTitle}>Help desk: support@jabss.app</Text>
              <Text style={styles.topTitle}>Compliance: compliance@jabss.app</Text>
            </LinearGradient>
            <View style={[styles.stickyView, styles.stickyViewBottom, {flex:10}]}>
              <ScrollView>
                <View style={{alignItems:"center", marginBottom:15,}}>
                  <Text style={styles.faqTitle}>Frequently answered questions</Text>
                </View>
                { faq.map( (item, key) => (
                  <View key={key} style={styles.faqContainer}>
                    <List.Accordion title={<View>
                      <Text style={styles.fQuestion}>{item.q}</Text>
                      </View>}>
                      <List.Item title={
                        <View>
                        <Text style={styles.fAnswer}>{item.a}</Text>
                        </View>
                      }/>
                    </List.Accordion>
                  </View>
                ))}
              </ScrollView>
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
  parentView:{
    flex:1,
  },
  topTitle:{
    fontWeight:"500",
    fontSize:18,
    color:colors.white,
  },
  topHeading:{
    fontWeight:"bold",
    fontSize:22,
    color:colors.white,
  },
  stickyView:{
    flex:3,
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
    marginBottom:2,
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

export default SupportScreen;
