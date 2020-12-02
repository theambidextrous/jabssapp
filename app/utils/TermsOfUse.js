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
import colors from "../config/colors";
import { ScrollView } from "react-native-gesture-handler";


function TermsOfUse({ navigation }) {
  return (
    <ScrollView>
      <View>
        <Text style={styles.title}>Foreword</Text> 
        <Text style={styles.paragraph}>This Document constitutes terms & conditions for all our users. It serves as a user agreement for using any of our services. It will be effective for all users as of October 28, 2020.</Text>
        <Text style={styles.title}>Welcome to Jabss!</Text>
        <Text style={styles.paragraph}>This user agreement is a contract between you and Jabss governing your use of your Jabss account and the Jabss services.  You must be a resident of the United States or one of its territories and at least 18 years old, or the age of majority in your state of residence to download our Apps and open a Jabss account and use the Jabss services. By opening and using a Jabss account, you agree to comply with all of the terms and conditions in this user agreement.  You also agree to comply with the following additional policies that apply to you:</Text>
        <Text style={styles.bullet}>• Privacy Policy</Text>
        <Text style={styles.paragraph}>Please read carefully all of the terms and conditions of this user agreement, terms of these policies and each of the other agreements that apply to you.  We may revise this agreement and any of the policies listed above from time to time.  The revised version will be effective at the time we post it, unless otherwise noted.</Text>
        <Text style={styles.paragraph}>If our changes reduce your rights or increase your responsibilities we will post a notice on the Policy Updates page of our website and provide you at least 30 days advance notice.  By continuing to use our services after any changes to this user agreement, you agree to abide and be bound by those changes.  If you do not agree with any changes to this user agreement, you may close your account.</Text>
        <Text style={styles.title}>Opening a Jabss Account</Text>
        <Text style={styles.paragraph}>To use Jabss services, you must download the Jabss application register by providing your name, email address, phone number and your billing address which will identify you.  We will take this information inputted during registration and store them in your profile.  Your billing address must be the same as the one on your debit card.</Text>
        <Text style={styles.paragraph}>Also, the information collected during registration, your phone number and email address will be shared to a third party (texting and emailing) purposes only.  If by any chance you have provided inaccurate information, we have a right to terminate your services.</Text>
        <Text style={styles.paragraph}>You are responsible for maintaining adequate security and control of any and all IDs, passwords, personal identification numbers, or any other codes that you use to access your Jabss account and services. You must keep your physical address, email address and other contact information current in your Jabss account profile.  This information can be edited however, the first billing address will not be edited and will be part of the records as long as you are using Jabss services.  If you move and need to update your billing address you can add the new one.</Text>
        <Text style={styles.paragraph}>We offer a single type of account  - personal Jabss account, which is covered by this user agreement.</Text>
        <Text style={styles.paragraph}>Jabss offers the following services:</Text>
        <Text style={styles.bulletMany}>• Send to Mpesa number</Text>
        <Text style={styles.bulletMany}>• Pay bills (Pay a bill on behalf of family or friends)</Text>
        <Text style={styles.title}>Closing your Jabss Account</Text>
        <Text style={styles.paragraph}>You may close your Jabss account and terminate your relationship with us at any time without cost, but you will remain liable for all obligations related to your Jabss account even after the Jabss account is closed.  When you close your Jabss account, we will cancel any scheduled or incomplete transactions.</Text>
        <Text style={styles.paragraph}>In certain cases, you may not close your Jabss account, including:</Text>
        <Text style={styles.bulletMany}>• To evade an investigation.</Text>
        <Text style={styles.bulletMany}>• If you have a pending transaction or an open dispute or claim.</Text>
        <Text style={styles.bulletMany}>• If your Jabss account is subject to a hold, limitation or reserve.</Text>
        <Text style={styles.title}>Add or Remove Credit Cards</Text>
        <Text style={styles.paragraph}>You can add to or remove a credit card from your Jabss account. You can maintain up to three credit cards with one of them set as the default.  Please keep your payment method information current (e.g. credit card number and expiration date). </Text>
        <Text style={styles.title}>Restrictions on money transfers from Jabss accounts</Text>
        <Text style={styles.paragraph}>We may set limits on your transfers, and you can view any transfer limit by logging into your Jabss account. The limits may be in the following forms:</Text>
        <Text style={styles.bulletMany}>• Maximum amount per single transaction</Text>
        <Text style={styles.bulletMany}>• Maximum amount in a day</Text>
        <Text style={styles.bulletMany}>• Maximum per a month</Text>
        <Text style={styles.title}>How we convert currency</Text>
        <Text style={styles.paragraph}>If Jabss converts currency, it will be completed at the transaction exchange rate we set for the relevant currency exchange. The transaction exchange rate is adjusted regularly and includes a currency conversion spread applied and retained by us on a base exchange rate to form the rate applicable to your conversion.</Text>

        <Text style={styles.title}>Account Statements</Text>
        <Text style={styles.paragraph}>You have the right to receive an account statement showing your Jabss account activities. You may view your statement(s) by logging into your Jabss account. However, this information will be available to you for up to 7 years. Any data older than 7 years will no longer be available to you as a Jabss account holder.</Text>

        <Text style={styles.title}>Sending Money</Text>
        <Text style={styles.paragraph}>You can send money to a family member or a friend using the send money feature in your Jabss account . You can send money to a family member or frined even if they don’t have a Jabss account using their MPESA mobile number.  We may, at our discretion, impose limits on the amount of money you can send, including money you send for bill payment.</Text>

        <Text style={styles.title}>Fees for sending money to family & friends</Text>
        <Text style={styles.paragraph}>The fees applicable to sending money will be disclosed to you in advance each time you initiate a transaction to send money.</Text>
        
        <Text style={styles.title}>Paying bills on behalf of family or friend</Text>
        <Text style={styles.paragraph}>You can pay bills on behalf of your family or friend using Jabss by simply selecting to send to an MPESA till number or MPESA paybill number and specifying the account of the person whose bill you are paying.</Text>

        <Text style={styles.title}>Fees for paying bills on behalf of family & friends</Text>
        <Text style={styles.paragraph}>The fees applicable to paying bills will be disclosed to you in advance each time you initiate a transaction to pay a bill.</Text>

        <Text style={styles.title}>Payment review</Text>
        <Text style={styles.paragraph}>When you compose a send or pay bill transaction on Jabss, you will be given an opportunity to review the transaction information before your card is debited.  The reason this is presented to you is because refunds are not possible within Jabss.</Text>
        
        <Text style={styles.title}>Refunds</Text>
        <Text style={styles.paragraph}>When you send money or pay a bill on behalf of a family or friend and the transaction is completed successfully, any refund is not possible.  It is your responsibility to ensure the recipient information is correct and accurate.</Text>

        <Text style={styles.title}>Dispute with us or your Credit Card Issuer</Text>
        <Text style={styles.paragraph}>If you used a credit card as a form of payment through your Jabss account and you are dissatisfied with the transaction, you may be entitled to dispute the transaction with your card issuer as per their policy. However, Jabss is not responsible for any card chargebacks.</Text>

        <Text style={styles.title}>Taxes and Information Reporting</Text>
        <Text style={styles.paragraph}>Our fees do not include any taxes, levies, duties or similar governmental assessments of any nature, including, for example, value-added, sales, use or withholding taxes, assessable by any jurisdiction (collectively, “taxes”). It is your responsibility to determine what, if any, taxes apply to the payments you make. </Text>

        <Text style={styles.title}>Restricted Activities </Text>
        <Text style={styles.paragraph}>In connection with your use of our websites, your Jabss account, the Jabss services, or in the course of your interactions with Jabss, other Jabss customers, or third parties, you must not:</Text>

        <Text style={styles.bulletMany}>• Breach this user agreement, the Jabss Privacy Policy, or any other agreement between you and Jabss.</Text>
        <Text style={styles.bulletMany}>• Violate any law, statute, ordinance, or regulation (for example, those governing financial services, anti-discrimination or false advertising).</Text>
        <Text style={styles.bulletMany}>• Infringe Jabss's or any third party's copyright, patent, trademark, trade secret or other intellectual property rights, or rights of publicity or privacy.</Text>
        <Text style={styles.bulletMany}>• Act in a manner that is defamatory, trade libelous, threatening or harassing.</Text>
        <Text style={styles.bulletMany}>• Provide false, inaccurate or misleading information.</Text>
        <Text style={styles.bulletMany}>• Send what we reasonably believe to be potentially fraudulent funds.</Text>
        <Text style={styles.bulletMany}>• Refuse to cooperate in an investigation or provide confirmation of your identity or any information you provide to us.</Text>
        <Text style={styles.bulletMany}>• Use your Jabss account or the Jabss services in a manner that Jabss, Visa, MasterCard, American Express, Discover or any other electronic funds transfer network reasonably believes to be an abuse of the card system or a violation of card association or network rules.</Text>

        <Text style={styles.title}>Actions we may take if you Engage in any Restricted Activities</Text>
        <Text style={styles.paragraph}>If we believe that you’ve engaged in any of these activities, we may take a number of actions to protect Jabss, its customers and others at any time at our sole discretion. The actions we may take include, but are not limited to the following:</Text>
        <Text style={styles.bulletMany}>• Terminate this user agreement, limit your Jabss account, and/or close or suspend your Jabss account, immediately and without penalty to us</Text>
        <Text style={styles.bulletMany}>• Refuse to provide the Jabss services to you in the future.</Text>
        <Text style={styles.paragraph}>If we close your Jabss account or terminate your use of the Jabss services for any reason, we’ll provide you with notice of our actions.</Text>

        <Text style={styles.title}>Liability for Unauthorized Transactions</Text>
        <Text style={styles.paragraph}>To protect yourself from unauthorized activity in your Jabss account, you should regularly log into your Jabss account and review your Jabss account statement. Jabss will notify you of each transaction by sending an email to your primary email address on file. You should review these transaction notifications to ensure that each transaction was authorized and accurately completed.</Text>
        
        <Text style={styles.title}>Other Legal Terms</Text>
        <Text style={styles.titleThin}>Communications between you and us</Text>

        <Text style={styles.paragraph}>If you provide us your email or mobile phone number, you agree that Jabss and its affiliates may contact you at that number using autodialed or prerecorded message calls or text messages to: (i) service your Jabss branded accounts, (ii) investigate or prevent fraud.  We will not use autodialed or prerecorded message calls or texts to contact you for marketing purposes unless we receive your prior express consent through opt in feature in Jabss.  We may share your email or mobile phone number with service providers with whom we contract to assist us with the activities listed above, but we will not share your mobile phone number with third parties for their own purposes without your consent.</Text> 
 
        <Text style={styles.titleThin}>Jabss's Rights</Text>
        <Text style={styles.paragraph}>Jabss, in its sole discretion, reserves the right to suspend or terminate this user agreement, access to or use of its websites, software, systems (including any networks and servers used to provide any of the Jabss services) operated by us or on our behalf or some or all of the Jabss services for any reason and at any time upon notice to you.</Text>

        <Text style={styles.titleThin}>Indemnification and Limitation of Liability</Text>
        <Text style={styles.paragraph}>In this section, we use the term “Jabss” to refer to Jabss, Inc., Jabss Corporation., and our affiliates, and each of their respective directors, officers, employees, agents, joint venturers, service providers and suppliers. Our affiliates include each entity that we control, we are controlled by or we are under common control with.</Text>
        
        <Text style={styles.titleThin}>Indemnification</Text>
        <Text style={styles.paragraph}>You must indemnify Jabss for actions related to your Jabss account and your use of the Jabss services. You agree to defend, indemnify and hold Jabss harmless from any claim or demand (including reasonable legal fees) made or incurred by any third party due to or arising out of your breach of this user agreement, your improper use of the Jabss services, your violation of any law or the rights of a third party and/or the actions or inactions of any third party to whom you grant permissions to use your Jabss account or access our websites, software, systems (including any networks and servers used to provide any of the Jabss services) operated by us or on our behalf, or any of the Jabss services on your behalf.</Text>

        <Text style={styles.titleThin}>Limitation of liability</Text>
        <Text style={styles.paragraph}>Jabss’s liability is limited with respect to your Jabss account and your use of the Jabss services.  In no event shall Jabss be liable for lost profits or any special, incidental or consequential damages (including without limitation damages for loss of data or loss of business) arising out of or in connection with our websites, software, systems (including any networks and servers used to provide any of the Jabss services) operated by us or on our behalf, any of the Jabss services, or this user agreement (however arising, including negligence), unless and to the extent prohibited by law.</Text>

        <Text style={styles.title}>Intellectual Property</Text>
        <Text style={styles.titleThin}>Jabss’s trademarks</Text>
        <Text style={styles.paragraph}>"Jabss.app," "Jabss," and all logos related to the Jabss services are either trademarks or registered trademarks of Jabss or Jabss's licensors. You may not copy, imitate, modify or use them without Jabss's prior written consent. In addition, all page headers, custom graphics, button icons, and scripts are service marks, trademarks, and/or trade dress of Jabss. You may not copy, imitate, modify or use them without our prior written consent. You may use HTML logos provided by Jabss for the purpose of directing web traffic to the Jabss services.  You may not alter, modify or change these HTML logos in any way, use them in a manner that mischaracterizes Jabss or the Jabss services or display them in any manner that implies Jabss's sponsorship or endorsement.  All right, title and interest in and to the Jabss websites, any content thereon, the Jabss services, the technology related to the Jabss services, and any and all technology and any content created or derived from any of the foregoing is the exclusive property of Jabss and its licensors.</Text>

        <Text style={styles.title}>Privacy</Text>
        <Text style={styles.paragraph}>Protecting your privacy is very important to us. Please review our Privacy Policy in order to better understand our commitment to maintaining your privacy, as well as our use and disclosure of your information.</Text>






    </View>
    </ScrollView>
  );
}
export default TermsOfUse;

const styles = StyleSheet.create({
  title:{
    fontWeight:"bold",
    margin:10,
    color:colors.secondary,
  },
  titleThin:{
    fontWeight:"400",
    margin:10,
    color:colors.secondary,
  },
  paragraph:{
    fontWeight:"300",
    color:colors.dark,
    lineHeight:18,
    textAlign:"justify",
    marginTop:5,
  },
  bullet:{
    fontWeight:"300",
    color:colors.dark,
    lineHeight:40,
    marginLeft:20,
  },
  bulletMany:{
    fontWeight:"300",
    color:colors.dark,
    lineHeight:22,
    marginLeft:20,
  }
});
