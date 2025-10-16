
import { Link, useRouter } from 'expo-router'
import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { ClerkAPIError } from '@clerk/types'
import { isClerkAPIResponseError } from '@clerk/clerk-react/errors'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { useEffect, useState } from 'react'
import { useAuth, useClerk, useSignIn } from '@clerk/clerk-expo'

export default function Forgot() {
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [hidePassword, setHidePassword] = useState(true);
    const [code, setCode] = useState('')
    const [successfulCreation, setSuccessfulCreation] = useState(false)
    const [secondFactor, setSecondFactor] = useState(false)
    const [error, setError] = useState('')

    const router = useRouter()
    const clerk = useClerk()
    const { isSignedIn } = useAuth()
    const { isLoaded, signIn, setActive } = useSignIn()

  useEffect(() => {
    if (isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, router])

  if (!isLoaded) {
    return null
  }

  
     // Send the password reset code to the user's email
  async function create() {
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      })
      .then((_) => {
        setSuccessfulCreation(true)
        setError('')
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage)
      })
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset() {
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === 'needs_second_factor') {
          setSecondFactor(true)
          setError('')
        } else if (result.status === 'complete') {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({
            session: result.createdSessionId,
            navigate: async ({ session }) => {
              if (session?.currentTask) {
                // Check for tasks and navigate to custom UI to help users resolve them
                // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
                console.log(session?.currentTask)
                return
              }

              router.push('/')
            },
          })
          setError('')
        } else {
          console.log(result)
        }
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage)
      })
  }
    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                  <ScrollView style={{flex: 1}}>
                    {
                        !successfulCreation ?
                        <View style={{flex: 1, padding: 50, justifyContent: 'center', rowGap: 20}}>
                            <Text style={{fontSize: 36}}>GroupShop</Text>
                            <Text style={{fontSize: 24}}>Forgot Password</Text>
                            <View style={{gap: 4, height: 65}}>
                                <Text style={{fontSize: 16}}>Email Address</Text>
                                <TextInput style={{ flex: 1, borderWidth: 1, borderRadius: 10}} maxLength={64} onChangeText={setEmailAddress} value={emailAddress}></TextInput>
                            </View>
                            {
                                error &&
                                <View>
                                    <Text style={{color: 'red'}}>An account with that email address doesn&apos;t exist. Please try again.</Text>    
                                </View> 
                            }
                            <Button onPress={!successfulCreation ? create : reset} title='Next'></Button>
                        </View>
                        :
                        <View style={{flex: 1, padding: 50, justifyContent: 'center', rowGap: 20}}>
                            <View style={{flex: 1, gap: 4}}>
                                <Text style={{fontSize: 16}}>New Password</Text>
                                <View style={{flex: 1, flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                                <TextInput secureTextEntry={hidePassword} style={{flex: 1, borderWidth: 1, borderRadius: 10}} onChangeText={setPassword} value={password}></TextInput>
                                <FontAwesome6 name={hidePassword === false ? 'eye-low-vision' : 'eye'} iconStyle='solid' size={20} onPress={() => setHidePassword(!hidePassword) }/>
                                </View>
                            </View>
                            <View style={{gap: 4}}>
                                <Text style={{fontSize: 16}}>Enter Reset Code Sent to Email</Text>
                                <TextInput style={{ borderWidth: 1, borderRadius: 10}} keyboardType='number-pad' onChangeText={setCode} value={code}></TextInput>
                            </View>
                            {
                                error &&
                                <View>
                                    <Text style={{color: 'red'}}>{error}</Text>    
                                </View> 
                            }
                            <Button onPress={!successfulCreation ? create : reset} title='Reset'></Button>
                        </View>
                    }
                  </ScrollView>
                </KeyboardAvoidingView>
    )
}