import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, ScrollView, Button, Platform } from 'react-native'
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { ClerkAPIError } from '@clerk/types'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { KeyboardController, KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [username, setUserName] = React.useState('')
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [hidePassword, setHidePassword] = React.useState(true)
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [errors, setErrors] = React.useState<ClerkAPIError[]>();
  
  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        firstName,
        lastName,
        username,
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      
      if (isClerkAPIResponseError(err)) setErrors(err.errors)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      }
      
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      if (isClerkAPIResponseError(err)) setErrors(err.errors)
    }
  }

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{flex: 1, padding: 25, paddingTop: 50, justifyContent: 'center', rowGap: 20}}>
          <Text style={{fontSize: 36}}>GroupShop</Text>
          <Text style={{fontSize: 24}}>Verify your email</Text>
          <TextInput
            keyboardType='number-pad'
            value={code}
            placeholder="Enter your verification code"
            onChangeText={(code) => setCode(code)}
          />
          <Button title='Verify' onPress={onVerifyPress}>
          </Button>
        </View>
      </KeyboardAvoidingView>
    )
  }

  

   return (
          <ScrollView>
            <View style={{flex: 1, padding: 25, paddingTop: 50, justifyContent: 'center', rowGap: 20}}>
                <Text style={{fontSize: 24}}>Sign Up</Text>
                <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                  <ScrollView style={{flex: 1}}>
                    <View style={{flex: 1, gap: 10}}>
                        <View style={{gap: 4}}>
                          <Text style={{fontSize: 16}}>First Name</Text>
                          <TextInput style={{borderWidth: 1, borderRadius: 10}} onChangeText={setFirstName} value={firstName}></TextInput>
                        </View>
                        <View style={{gap: 4}}>
                          <Text style={{fontSize: 16}}>Last Name</Text>
                          <TextInput style={{borderWidth: 1, borderRadius: 10}} onChangeText={setLastName} value={lastName}></TextInput>
                        </View>
                        <View style={{gap: 4}}>
                          <Text style={{fontSize: 16}}>Username</Text>
                            <TextInput style={{ borderWidth: 1, borderRadius: 10}} onChangeText={setUserName} maxLength={64} value={username}></TextInput>
                        </View>
                        <View style={{gap: 4}}>
                            <Text style={{fontSize: 16}}>Email Address</Text>
                            <TextInput style={{ borderWidth: 1, borderRadius: 10}} onChangeText={setEmailAddress} value={emailAddress}></TextInput>
                        </View>
                        <View style={{flex: 1, gap: 4}}>
                          <Text style={{fontSize: 16}}>Password</Text>
                          <View style={{flex: 1, flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                            <TextInput secureTextEntry={hidePassword} style={{flex: 1, borderWidth: 1, borderRadius: 10}} onChangeText={setPassword} value={password}></TextInput>
                            <FontAwesome6 name={hidePassword === false ? 'eye-low-vision' : 'eye'} iconStyle='solid' size={20} onPress={() => setHidePassword(!hidePassword) }/>
                          </View>
                        </View>
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>
                <Button title="Sign Up" onPress={onSignUpPress}></Button>
                {errors && (
                  errors.map((err) => 
                    <View key={err.longMessage}>
                      <Text style={{color: "red"}}>{err.longMessage}</Text>
                    </View>
                  ))}
                <View>
                    <Text>Already have an account? <Link href={'/sign-in'}><Text style={{color: 'blue'}}>Sign in</Text></Link></Text>
                </View>
            </View>
          </ScrollView>
      )
}