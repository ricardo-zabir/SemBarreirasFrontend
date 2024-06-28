/**
 * @author               Bianca Alves @bianca.alves
 * Screen de perfil do usuário
 * @example              <ProfileScreen />
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { Icon, Divider } from 'react-native-paper';

import colors from '../constants/colors';

import HeaderComponent from '../components/HeaderComponent';
import NavButtonComponent from '../components/NavButtonComponent';
import CheckButton from '../components/CheckButton';
import LoaderComponent from '../components/LoaderComponent';
import TextBoxComponent from '../components/TextBoxComponent';
import api from '../apis/api';

export default function ProfileScreen({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userInfo, setUserInfo] = React.useState(null);
  const [token, setToken] = React.useState('');
  const [id, setId] = React.useState('');

  const convertToText = array => {
    const texts = array.map((str, index) => {
      var text = '';

      if (str === '4c109301-44a7-3270-8ffa-23c9c691dbd9') text = 'Motora';

      if (str === '4557e774-91fe-3dbd-9a60-55aeb0ed00d7') text = 'Visual';

      if (str === 'e0b7f938-1f49-309a-83f5-221dae4009cc') text = 'Cognitiva';

      if (str === '85f1130d-59b1-3804-b236-c03510434726') text = 'Auditiva';

      return text;
    });
    return texts;
  };

  React.useEffect(() => {
    async function getUserTokenId() {
      var valueToken = await AsyncStorage.getItem('token');
      setToken(valueToken);

      var valueId = await AsyncStorage.getItem('id');
      setId(valueId);
    }

    getUserTokenId();
  }, []);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`v1/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await response.data;

        const data = {
          name: userData.name,
          email: userData.email,
          date: userData.birthdate,
          profession: userData.occupation,
          celNumber: userData.phone,
          description: userData.description,
          disabilities: convertToText(userData.disabilities),
        };

        setUserInfo(data);
      } catch (e) {
        if (e.response && e.response.status === 401) {
          console.log('ERRO:', e.response.data.error);
          Alert.alert('Erro', e.response.data.error);
        } else if (e.response && e.response.status === 404) {
          console.log('ERRO:', e.response.data.error);
          Alert.alert('Erro', e.response.data.error);
        } else {
          console.log('ERRO:', 'Aconteceu um erro inesperado');
        }

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
          }),
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (token !== '' && id !== '') {
      fetchData();
    }
  }, [token, id]);

  if (isLoading || !userInfo) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor={colors.backgroundStatusBar} importantForAccessibility='no' />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoaderComponent accessibilityLabel='Carregando dados do usuário' />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.backgroundStatusBar} importantForAccessibility='no' />
      <HeaderComponent isProfilePage={true}
        leftPress={() => navigation.goBack()}
        middlePress={() => navigation.navigate('HomeScreen')}
      />
      <ScrollView>
        <View>
          <View style={styles.picture}>
            <Icon source="account-circle" size={130} color={colors.blue} />
            <Text style={styles.name} importantForAccessibility="yes">
              {userInfo.name}
            </Text>
            <Divider style={styles.separator} importantForAccessibility="no" />
          </View>
        </View>
        <View style={styles.disabilities} accessibilityLabel="Deficiências">
          {userInfo.disabilities.length > 0 &&
            userInfo.disabilities.map((disability, index) => (
              <CheckButton
                key={index}
                text={disability}
                state={true}
                clickable={false}
              />
            ))}
        </View>

        <View style={styles.screen}>
          <View style={styles.infoContainer} importantForAccessibility="no">
            <Text style={styles.title}>Profissão</Text>
            <Text style={styles.text}>{userInfo.profession}</Text>
          </View>
          <View style={styles.infoContainer} importantForAccessibility="no">
            <Text style={styles.title}>E-mail</Text>
            <Text style={styles.text}>{userInfo.email}</Text>
          </View>
          <View style={styles.infoContainer} importantForAccessibility="no">
            <Text style={styles.title}>Celular</Text>
            <Text style={styles.text}>{userInfo.celNumber}</Text>
          </View>
          <View style={styles.infoContainer} importantForAccessibility="no">
            <Text style={styles.title}>Data de Nascimento</Text>
            <Text style={styles.text}>{userInfo.date}</Text>
          </View>
          <View style={styles.box} importantForAccessibility='no'>
            <Text style={styles.title}>Descrição</Text>
            <TextBoxComponent
              placeholder={userInfo.description}
              accessibilityLabel={userInfo.description}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <NavButtonComponent
            text="Editar perfil"
            img={'Edit'}
            onClick={() =>
              navigation.navigate('UpdateBasicInfoScreen', userInfo)
            }
          />
          <NavButtonComponent
            text="Locais cadastrados"
            img={'Shop'}
            onClick={() => navigation.navigate('EstablishmentsUserScreen')}
          />
          <NavButtonComponent
            text="Desativar conta"
            img={'Warning'}
            textIsRed={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundScreen
  },

  screen: {
    marginHorizontal: '7%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: colors.backgroundScreen,
  },

  picture: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1%',
  },
  name: {
    fontFamily: 'Oxygen-Bold',
    fontSize: 25,
    textAlign: 'center',
    color: colors.textBlack,
  },
  separator: {
    borderWidth: 0.4,
    borderColor: colors.borderStrokeOpacity,
    minWidth: '86%',
    marginVertical: '3%',
  },

  disabilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 20,
    marginBottom: '3%',
  },

  infoContainer: {
    paddingBottom: '2%',
  },
  title: {
    fontFamily: 'Oxygen-Bold',
    fontSize: 16,
    textAlign: 'left',
    color: colors.textBlack,
  },
  text: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
    color: colors.textBlack,
    textAlign: 'left',
    paddingBottom: '3%',
  },

  buttonContainer: {
    display: 'flex',
    minWidth: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '4%',
    paddingHorizontal: '7%',
  },

  box: {
    minWidth: '100%',
    paddingBottom: '2%',
    columnGap: 10
  },
});
