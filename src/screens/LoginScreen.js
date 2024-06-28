/**
 * @author               Bianca Alves @bianca.alves
 * Screen da Login
 * @example              <LoginScreen />
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import colors from '../constants/colors';
import Logo from '../../src/assets/imgs/Logo.png';

import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';
import api from '../apis/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const handleSubmit = async () => {
    const errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) errors.email = 'Por favor, insira seu email';
    else if (!emailRegex.test(email)) errors.email = 'Email inválido!';

    if (!password) errors.password = 'Por favor, insira sua senha';
    else if (password.length < 8) errors.password = 'Senha deve conter no mínimo 8 dígitos!';

    if (Object.keys(errors).length === 0) {
      const data = { email: email, password: password };

      try {
        // Realiza a requisição e salva os dados
        const response = await api.post('v1/auth/login', data);
        const token = response.data.token;
        const id = response.data.userId;
        const isAdmin = response.data.admin.toString();
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('id', id);
        await AsyncStorage.setItem('admin', isAdmin);

        if (isAdmin === 'true') {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'AdminEstablishmentsToApproveScreen' }],
            })
          );
        }
        else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeScreen' }],
            })
          );
        }
      } catch (e) {
        if (e.response && e.response.status === 401) {
          Alert.alert('Erro', e.response.data.error);
        } else {
          Alert.alert('Erro', 'Aconteceu um erro inesperado');
          console.log(e);
        }
      }
      return;
    }

    accessibilityLabel = { errors }
    setErrors(errors);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>
          <View>
            <StatusBar backgroundColor={colors.backgroundStatusBar} importantForAccessibility='no' />
            <View style={styles.logoContainer}
              accessibilityLabel='Bem-vindo ao Sem Barreiras'>
              <Image source={Logo} />
              <Text style={styles.textLogoName}>Sem Barreiras</Text>
              <Text style={styles.textLogoDescription}>Acessibilidade</Text>
            </View>
          </View>

          <View style={styles.screen}>
            <View style={styles.inputContainer}>
              <InputComponent
                emailType
                label='E-mail*'
                placeholder='exemplo@email.com'
                onChangeText={email => setEmail(email)}
                value={email}
                errorMessage={errors.email} />

              <InputComponent
                passwordType
                label='Senha*'
                placeholder='********'
                onChangeText={password => setPassword(password)}
                value={password}
                errorMessage={errors.password} />
            </View>

            <View style={styles.buttonContainer}>
              <ButtonComponent
                text='Entrar'
                onPress={handleSubmit}
                isBlue={true}
                accessibilityLabel='Entrar' />

              <TouchableOpacity
                style={styles.textButtonContainer}
                accessibilityLabel='Esqueci minha senha'
                onPress={() => console.log('Esqueci senha')}>
                <Text style={styles.textButton}>Esqueceu sua senha?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.textButtonContainer}
                accessibilityLabel='Cadastrar-se'
                onPress={() => navigation.navigate('SignUpBasicInfoScreen')}>
                <Text style={styles.textButton}>Ainda não tem conta? Cadastre-se!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView >
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundScreen
  },

  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundScreen,
  },

  logoContainer: {
    display: 'flex',
    minWidth: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '5%',
    marginTop: '25%',
    paddingBottom: '9%',
    backgroundColor: colors.backgroundScreen,
  },
  textLogoName: {
    fontFamily: 'Oxygen-Bold',
    fontSize: 25,
    color: colors.textBlack,
  },
  textLogoDescription: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 18,
    color: colors.textBlack,
  },

  inputContainer: {
    display: 'flex',
    gap: 7,
    minWidth: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '6%',
  },

  buttonContainer: {
    display: 'flex',
    gap: 22,
    minWidth: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6%',
  },

  textButtonContainer: {
    alignItems: 'center',
    backgroundColor: colors.backgroundScreen,
    padding: 10,
  },
  textButton: {
    fontFamily: 'Quicksand-SemiBold',
    fontSize: 16,
    color: colors.textBlue,
  }
});
