import React from 'react';
import { StyleSheet, View, Text, ScrollView, StatusBar } from 'react-native';

import colors from '../constants/colors';
import { fonts } from '../assets/fonts/fontlist';

import HeaderComponent from '../components/HeaderComponent';
import ButtonComponent from '../components/ButtonComponent';
import LoaderComponent from '../components/LoaderComponent';
import AdminEstablishmentCardComponent from '../components/AdminEstablishmentCardComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import ModalBoxComponent from '../components/ModalBoxComponent';
import api from '../apis/api';

export default function AdminEstablishmentsToApproveScreen({ navigation }) {
  const [establishments, setEstablishments] = React.useState([]);
  const [token, setToken] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  React.useEffect(() => {
    async function getUserToken() {
      var value = await AsyncStorage.getItem('token');
      setToken(value);
    }

    getUserToken();
  }, []);

  React.useEffect(() => {
    async function fetchData() {
      console.log(token);
      try {
        const response = await api.get('v1/establishments', {
          params: { status: 'PENDING' },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setEstablishments(response.data);

        setIsLoading(false);
      } catch (e) {
        console.log(e);

        setIsLoading(false);
      }
    }
    if (token !== '') {
      fetchData();
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token', null);
      await AsyncStorage.removeItem('email', null);
      await AsyncStorage.removeItem('id', null);
      await AsyncStorage.removeItem('isAdmin', null);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleCardNavigation = (id) => {
    navigation.navigate('AdminEstablishmentScreen', { id });
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        backgroundColor={colors.backgroundStatusBar}
        importantForAccessibility="no"
      />
      <HeaderComponent
        leftPress={showModal}
        rightPress={() => navigation.navigate('ProfileScreen')}
        isHomePage={true}
      />
      <View style={styles.screenContent}>
        <Text
          style={{ fontFamily: 'Oxygen-Bold', fontSize: 26, marginTop: '3%' }}
        >
          Gerenciar locais cadastrados
        </Text>
        <View style={styles.subtitle}>
          <Text
            style={{ fontFamily: 'Oxygen-Light', fontSize: 18, color: colors.textBlack }}
          >
            Aqui você pode autorizar cadastros e edições de locais cadastrados
          </Text>
        </View>
        <View style={styles.divisory}>
        </View>
        <ScrollView contentContainerStyle={isLoading ? styles.loading : {}}>
          {isLoading ? ( // Carregando...
            <LoaderComponent accessibilityLabel="Carregando lista de estabelecimentos" />
          ) : establishments.length ? (
            establishments.map((establishment, index) => (
              <View
                minWidth={'100%'}
                paddingBottom={10}
                paddingTop={10}
                key={index}
                backgroundColor={colors.backgroundScreen}
              >
                <AdminEstablishmentCardComponent
                  data={establishment}
                  onClick={() => handleCardNavigation(establishment.id)} />
              </View>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                {establishments.length === 0
                  ? 'Nenhum estabelecimento encontrado'
                  : 'Nenhum estabelecimento disponível no momento'}
              </Text>
            </View>
          )}
        </ScrollView>
        <ModalBoxComponent
          visible={visible}
          onDismiss={hideModal}
          width={300}
          height={250}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: 'Oxygen-Bold',
              color: colors.textBlack
            }}
          >
            Confirmação de saída
          </Text>
          <Text style={{
            textAlign: 'center',
            fontFamily: 'Oxygen-Regular',
            color: colors.textBlack
          }}>
            Tem certeza que deseja sair?
          </Text>
          <View style={{ paddingBottom: 10 }}>
            <ButtonComponent
              text="Sair"
              onPress={() => {
                handleLogout();
              }}
              customWidth={230}
              isBlue={true}
              accessibilityLabel="Sair"
            />
          </View>
          <View>
            <ButtonComponent
              text="Cancelar"
              onPress={hideModal}
              customWidth={230}
              isBlue={false}
              accessibilityLabel="Cancelar"
            />
          </View>
        </ModalBoxComponent>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.backgroundScreen,
  },
  screenContent: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    backgroundColor: colors.backgroundScreen,
  },
  subtitle: {
    flexDirection: 'row',
    alignContent: 'center',
    alignContent: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  divisory: {
    flexDirection: 'row',
    alignContent: 'center',
    alignContent: 'center',
    marginBottom: 20,
    backgroundColor: colors.borderStrokeBlack,
    minHeight: 1
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
