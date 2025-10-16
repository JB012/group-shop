import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { ClerkAPIError } from '@clerk/types'
import { isClerkAPIResponseError } from '@clerk/clerk-react/errors'
import React from 'react'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [hidePassword, setHidePassword] = React.useState(true)

  const [errors, setErrors] = React.useState<ClerkAPIError[]>();

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
     setErrors(undefined);

    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      
      if (isClerkAPIResponseError(err)) setErrors(err.errors)
    }
  }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView style={{flex: 1}}>
            <View style={{flex: 1, padding: 50, justifyContent: 'center', rowGap: 20}}>
                <Text style={{fontSize: 36}}>GroupShop</Text>
                <Text style={{fontSize: 24}}>Sign In</Text>
                <View style={{gap: 4, height: 65}}>
                    <Text style={{fontSize: 16}}>Username or Email</Text>
                    <TextInput style={{ flex: 1, borderWidth: 1, borderRadius: 10}} maxLength={64} onChangeText={setEmailAddress} value={emailAddress}></TextInput>
                </View>
                <View style={{ height: 65, gap: 4}}>
                    <Text style={{fontSize: 16}}>Password</Text>
                    <View style={{flex: 1, flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                      <TextInput secureTextEntry={hidePassword} style={{flex: 1, borderWidth: 1, borderRadius: 10}} onChangeText={setPassword} value={password}></TextInput>
                      <FontAwesome6 name={hidePassword === false ? 'eye-low-vision' : 'eye'} iconStyle='solid' size={20} onPress={() => setHidePassword(!hidePassword) }/>
                    </View>
                  </View>
                <Link style={{alignSelf: 'flex-end'}} href={'/forgot'}><Text style={{color: 'blue'}}>Forgot your password?</Text></Link>
                <Button title="Sign In" onPress={onSignInPress}></Button>
                <View>
                    <Text>Don&apos;t have an account? <Link href={'/sign-up'}><Text style={{color: 'blue'}}>Sign up</Text></Link></Text>
                </View>

                {errors && (
                  <View>
                    <Text style={{color: "red"}}>Authentification failure: Invalid username or password</Text>
                  </View>
                )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
    ) 
}
