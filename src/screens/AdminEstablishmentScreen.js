/**
 * @author                    Bianca Alves @bianca.alves
 *
 * @example                   <AdminEstablishmentScreen />
 */

import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import colors from '../constants/colors';

import HeaderComponent from '../components/HeaderComponent';
import ImageCarouselComponent from '../components/ImageCarouselComponent';
import DisabilityTagsComponent from '../components/DisabilityTagsComponent';
import TagDisplayComponent from '../components/TagDisplayComponent';
import GrayLikeIcon from '../assets/icons/GrayLikeIcon';
import BlueLikeIcon from '../assets/icons/BlueLikeIcon';
import GrayDislikeIcon from '../assets/icons/GrayDislikeIcon';
import BlueDislikeIcon from '../assets/icons/BlueDislikeIcon';
import PhoneIcon from '../assets/icons/PhoneIcon';
import GlobeIcon from '../assets/icons/GlobeIcon';
import LocationIcon from '../assets/icons/LocationIcon';
import LoaderComponent from '../components/LoaderComponent';
import ButtonComponent from '../components/ButtonComponent';
import ModalBoxComponent from '../components/ModalBoxComponent';
import api from '../apis/api';

export default function AdminEstablishmentScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [establishmentInfo, setEstablishmentInfo] = React.useState(null);
  const [latitude, setLatitude] = React.useState(null);
  const [longitude, setLongitude] = React.useState(null);
  const [address, setAddress] = React.useState('');
  const [token, setToken] = React.useState('');

  const { id } = route.params;

  React.useEffect(() => {
    async function getUserToken() {
      var valueToken = await AsyncStorage.getItem('token');
      setToken(valueToken);
    }
    getUserToken();
  }, []);

  React.useEffect(() => {
    async function fetchData() {
      console.log(id);
      console.log(token);
      try {
        const response = await api.get(`v1/establishments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const establishmentData = await response.data;

        setLatitude(establishmentData.address.latitude);
        setLongitude(establishmentData.address.longitude);
        setAddress(establishmentData.address);

        const data = {
          id: establishmentData.id,
          name: establishmentData.name,
          type: establishmentData.type,
          cnpj: establishmentData.cnpj,
          address: establishmentData.address,
          phone: establishmentData.phone,
          site: establishmentData.site,
          totalLikes: establishmentData.totalLikes,
          totalDislikes: establishmentData.totalDislikes,
          disabilities: establishmentData.disabilities,
          accessiblities: establishmentData.accessibilities,
          image: establishmentData.images,
        };
        setEstablishmentInfo(data);

        setIsLoading(false);
      } catch (e) {
        if (e.response && e.response.status === 401) {
          console.log('ERRO:', e.response.data.error);
          Alert.alert('Erro', e.response.data.error);
        } else if (e.response && e.response.status === 404) {
          console.log('ERRO:', e.response.data.error);
          Alert.alert('Erro', e.response.data.error);
        } else {
          console.log(e.response.data);
          console.log('Erro:', 'Aconteceu um erro inesperado');
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'AdminEstablishmentsToApproveScreen' }],
          })
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (token !== '') {
      fetchData();
    }
  }, [token]);


  const [isClickedLike, setIsClickedLike] = useState(true);
  const [isClickedDislike, setIsClickedDislike] = useState(true);
  const [colorTextDislike, setColorTextDislike] = useState(colors.textGray);
  const [colorTextLike, setColorTextLike] = useState(colors.textGray);

  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handlePressLike = () => {
    setIsClickedLike(!isClickedLike);
    setColorTextLike(!isClickedLike ? colors.textGray : colors.blue);
    setColorTextDislike(colors.textGray);

    if (isClickedLike === true) {
      setIsClickedDislike(true);
    }
  };

  const handlePressDislike = () => {
    setIsClickedDislike(!isClickedDislike);
    setColorTextDislike(!isClickedDislike ? colors.textGray : colors.blue);
    setColorTextLike(colors.textGray);

    if (isClickedDislike === true) {
      setIsClickedLike(true);
    }
  };

  const openGoogleMaps = () => {
    if (latitude == null || longitude == null) {
      Alert.alert(
        'Erro',
        'Os dados de latitude e longitude desse estabelecimento não foram definidos.',
      );
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

      Linking.openURL(url).catch(err =>
        console.error('Erro ao abrir o Google Maps:', err),
      );
    }
  };

  const handleStatus = async status => {
    const data = {
      status: status
    };

    try {
      const response = await api.patch(`v1/establishments/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      hideModal;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        console.log('ERRO:', e.response.data.error);
        Alert.alert('Erro', e.response.data.error);
      } else if (e.response && e.response.status === 403) {
        console.log('ERRO:', e.response.data.error);
        Alert.alert('Erro', e.response.data.error);
      } else if (e.response && e.response.status === 404) {
        console.log('ERRO:', e.response.data.error);
        Alert.alert('Erro', e.response.data.error);
      } else {
        console.log(e.response.data);
        console.log('Erro:', 'Aconteceu um erro inesperado');
      }
    } finally {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AdminEstablishmentsToApproveScreen' }],
        })
      );
    }
  };

  if (isLoading || !establishmentInfo) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor={colors.backgroundStatusBar}
          importantForAccessibility="no"
        />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <LoaderComponent accessibilityLabel="Carregando dados do local" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider backgroundColor={colors.backgroundScreen}>
      <HeaderComponent
        leftPress={() => navigation.goBack()}
        middlePress={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeScreen' }],
            }),
          );
        }}
        rightPress={() => navigation.navigate('ProfileScreen')}
      />
      <ScrollView>
        <View style={styles.imageCarousel}>
          <ImageCarouselComponent data={establishmentInfo.image} />
          <View style={styles.disabilityTags}>
            <DisabilityTagsComponent
              disabilities={establishmentInfo.disabilities}
            />
          </View>
          <View style={styles.screen}>
            <Text style={[styles.nameText, { fontSize: 25 }]}>
              {establishmentInfo.name}
            </Text>
            <Text style={styles.establishmentType}>
              {establishmentInfo.type}
            </Text>
            <View style={styles.tagDisplay}>
              <TagDisplayComponent tagList={establishmentInfo.accessiblities} />
            </View>
            <Text style={styles.nameText}>Avalie este lugar</Text>
            <Text style={styles.establishmentType}>Dê sua opinião</Text>

            <View style={styles.buttons}>
              <View
                style={{
                  marginLeft: '7%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <TouchableOpacity onPress={handlePressLike}>
                  {isClickedLike ? <GrayLikeIcon /> : <BlueLikeIcon />}
                </TouchableOpacity>
                <Text style={[styles.buttonText, { color: colorTextLike }]}>
                  Achei accessível
                </Text>
              </View>
              <View
                style={{
                  marginRight: '7%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <TouchableOpacity onPress={handlePressDislike}>
                  {isClickedDislike ? <GrayDislikeIcon /> : <BlueDislikeIcon />}
                </TouchableOpacity>
                <Text style={[styles.buttonText, { color: colorTextDislike }]}>
                  Não achei accessível
                </Text>
              </View>
            </View>
            <View style={{ marginTop: '5%' }}>
              <Text
                style={{
                  fontFamily: 'Oxygen-Bold',
                  fontSize: 15,
                  color: colors.textBlue,
                  textDecorationLine: 'underline'
                }}
              >
                Escreva uma resenha
              </Text>

              <View style={{ marginTop: '8%', marginBottom: '3%' }}>
                <View style={styles.informations}>
                  <PhoneIcon />
                  <Text style={styles.infoText}>{establishmentInfo.phone}</Text>
                </View>

                <View style={styles.informations}>
                  <GlobeIcon />
                  <Text style={styles.infoText}>{establishmentInfo.site}</Text>
                </View>

                <View style={styles.informations}>
                  <LocationIcon />
                  <Text style={styles.infoText}>
                    {`${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.state}, ${address.cep}${address.additionalDetails ? ` - ${address.additionalDetails}` : ''}`}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={openGoogleMaps}
                accessibilityHint="Clique duas vezes para abrir o Google Maps e verificar como chegar nesse estabelecimento."
              >
                <Text
                  style={{
                    fontFamily: 'Oxygen-Bold',
                    fontSize: 14,
                    color: colors.blue,
                    marginTop: '3%',
                  }}
                >
                  Saiba como chegar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <ButtonComponent
              text='Aprovar'
              isBlue
              accessibilityLabel='Aprovar estabelecimento'
              onPress={showModal} />
            <ButtonComponent
              text='Rejeitar'
              accessibilityLabel='Rejeitar estabelecimento'
              onPress={() => handleStatus('DENIED')} />
          </View>
        </View>
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
          Aprovar local
        </Text>
        <Text style={{
          textAlign: 'center',
          fontFamily: 'Quicksand-Medium',
          fontSize: 16,
          color: colors.textBlack
        }}>
          Ao aprovar este local, ele será disponibilizado a todos usuários
        </Text>
        <View style={{ paddingBottom: 10, }}>
          <ButtonComponent
            text="Aprovar"
            onPress={() => handleStatus('APPROVED')}
            customWidth={230}
            isBlue={true}
            accessibilityLabel="Aprovar"
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
    </SafeAreaProvider>
  );
}

const styles = new StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundScreen,
  },
  imageCarousel: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },

  screen: {
    width: '90%',
  },

  disabilityTags: {
    justifyContent: 'center',
    alignItems: 'right',
    width: '90%',
    marginTop: '2%',
  },

  tagDisplay: {
    justifyContent: 'space-between',
    maxHeight: '20%', // Bug na altura do scroll da tela
    maxWidth: '100%',
    marginTop: '5%',
    marginBottom: '5%',
  },

  nameText: {
    fontFamily: 'Oxygen-Bold',
    color: colors.textBlack,
    fontSize: 18,
    marginTop: '2%',
  },

  infoText: {
    fontFamily: 'Oxygen-Regular',
    color: colors.textBlack,
    fontSize: 14,
    marginHorizontal: '2%',
  },

  establishmentType: {
    fontFamily: 'Quicksand-Medium',
    color: colors.textBlack,
    fontSize: 15,
  },

  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: '3%',
  },

  buttonText: {
    fontFamily: 'Oxygen-Bold',
    fontSize: 14,

    textAlign: 'center',
  },

  informations: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: '2%',
  },

  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: '5%',
    padding: 5
  }
});
