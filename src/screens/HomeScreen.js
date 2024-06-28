import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';

import colors from '../constants/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HeaderComponent from '../components/HeaderComponent';
import SearchBarComponent from '../components/SearchBarComponent';
import ButtonComponent from '../components/ButtonComponent';
import EstablishmentCardComponent from '../components/EstablishmentCardComponent';
import LoaderComponent from '../components/LoaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilterIcon from '../assets/icons/FilterIcon';
import { CommonActions } from '@react-navigation/native';
import ModalBoxComponent from '../components/ModalBoxComponent';

import api from '../apis/api';

export default function HomeScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [establishments, setEstablishments] = React.useState([]);
  const [token, setToken] = React.useState('');
  const [filteredEstablishments, setFilteredEstablishments] = React.useState(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(true);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  React.useEffect(() => {
    async function getUserToken() {
      var value = await AsyncStorage.getItem('token');
      setToken(value);
    }
    console.log(token);
    getUserToken();
  }, []);

  React.useEffect(() => {
    async function fetchData() {
      if (route.params) {
        setEstablishments(route.params.establishments);
      } else {
        try {
          const response = await api.get('v1/establishments', {
            params: { status: 'APPROVED' },
            headers: { Authorization: `Bearer ${token}` },
          });
          setEstablishments(response.data);

          setIsLoading(false);
        } catch (e) {
          console.log(e);

          setIsLoading(false);
        }
      }
    }
    if (token !== '') {
      fetchData();
      filterEstablishmentsByName();
    }
  }, [token, route.params]);

  const filterEstablishmentsByName = () => {
    const filtered = establishments.filter(establishment =>
      establishment.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredEstablishments(filtered);
  };

  React.useEffect(() => {
    filterEstablishmentsByName();
  }, [searchQuery || establishments]);

  const handleChangeSearchQuery = text => {
    setSearchQuery(text);
  };

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
    navigation.navigate('EstablishmentScreen', { id });
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
          Encontre locais acessíveis perto de você
        </Text>
        <View style={styles.searchBarContainer}>
          <View style={{ maxWidth: '84%' }}>
            <SearchBarComponent
              onChangeText={query => handleChangeSearchQuery(query)}
              value={searchQuery}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              margin: 10,
            }}
          >
            <View
              style={{ alignItems: 'center' }}
              accessibilityLabel="Aplicar filtro de busca"
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('EstablishmentFilterScreen')}
                accessibilityLabel="Clique duas vezes para realizar uma busca com filtros"
              >
                <FilterIcon />
                <Text
                  style={{
                    fontFamily: 'Oxygen-Bold',
                    color: colors.textBlack,
                    fontSize: 16,
                  }}
                  importantForAccessibility="no"
                >
                  Filtro
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <ButtonComponent
            text="Cadastrar um local"
            onPress={() =>
              navigation.navigate('EstablishmentRegistrationScreen')
            }
            customWidth={'100%'}
            isBlue={true}
            accessibilityLabel="Clique para cadastrar um novo estabelecimento"
          />
        </View>
        <Text
          style={{
            fontFamily: 'Oxygen-Bold',
            fontSize: 20,
            marginBottom: 10,
            marginTop: 8,
            color: colors.textBlack,
          }}
        >
          Locais populares
        </Text>
        <ScrollView contentContainerStyle={isLoading ? styles.loading : {}}>
          {isLoading ? (
            <LoaderComponent accessibilityLabel="Carregando lista de estabelecimentos" />
          ) : filteredEstablishments.length ? (
            filteredEstablishments.map((establishment, index) => (
              <View
                minWidth={'100%'}
                paddingBottom={10}
                paddingTop={10}
                key={index}
                backgroundColor={colors.backgroundScreen}
              >
                <EstablishmentCardComponent
                  data={establishment}
                  onClick={handleCardNavigation}
                />
              </View>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                {establishments.length === 0 && searchQuery !== ''
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
              color: colors.textBlack,
            }}
          >
            Confirmação de saída
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Quicksand-Medium',
              fontSize: 16,
              color: colors.textBlack,
            }}
          >
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
  searchBarContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
