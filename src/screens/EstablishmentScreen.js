import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ImageCarouselComponent from '../components/ImageCarouselComponent';
import DisabilityTagsComponent from '../components/DisabilityTagsComponent';
import TagDisplayComponent from '../components/TagDisplayComponent';
import fontlist from '../assets/fonts/fontlist';
import colors from '../constants/colors';
import GrayLikeIcon from '../assets/icons/GrayLikeIcon';
import BlueLikeIcon from '../assets/icons/BlueLikeIcon';
import GrayDislikeIcon from '../assets/icons/GrayDislikeIcon';
import BlueDislikeIcon from '../assets/icons/BlueDislikeIcon';
import PhoneIcon from '../assets/icons/PhoneIcon';
import GlobeIcon from '../assets/icons/GlobeIcon';
import LocationIcon from '../assets/icons/LocationIcon';
import LoaderComponent from '../components/LoaderComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import AvaliationPopUpComponent from '../components/AvaliationPopUpComponent';
import NavButtonComponent from '../components/NavButtonComponent';
import api from '../apis/api';
import CommentComponent from '../components/CommentComponent';

export default function EstablishmentScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [establishmentInfo, setEstablishmentInfo] = React.useState(null);
  const [latitude, setLatitude] = React.useState(null);
  const [longitude, setLongitude] = React.useState(null);
  const [address, setAddress] = React.useState('');
  const [token, setToken] = React.useState('');
  const [comments, setComments] = React.useState([]);
  const [isLoadingComments, setIsLoadingComments] = React.useState(true);

  const { id } = route.params;

  React.useEffect(() => {
    async function getUserTokenId() {
      var valueToken = await AsyncStorage.getItem('token');
      setToken(valueToken);
    }
    getUserTokenId();
  }, []);

  React.useEffect(() => {
    async function getComments() {
      try {
        console.log('\nID: ', id, '\nToken: ', token);
        const response = await api.get(`/v1/establishments/${id}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(response.data);
      } catch (e) {
        console.log('Erro', e);
      } finally {
        setIsLoadingComments(false);
      }
    }
    if (token !== ''){
      getComments();
    }
  }, [token]);

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
          latitude: establishmentData.latitude,
          longitude: establishmentData.longitude,
          status: establishmentData.status,
          createdByUser: establishmentData.createdByUser,
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
            routes: [{ name: 'HomeScreen' }],
          }),
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


  const handleDelete = async() => {
    try{
      console.log(establishmentInfo.id)
    const response = await api.delete(`v1/establishments/${establishmentInfo.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Alert.alert(
      'Sucesso',
      'Estabelecimento excluído',
    );
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        }),
      );
    } catch (e) {
      console.log(e);
      Alert.alert(
        'Erro',
        'Não foi possível excluir o estabelecimento',
      );
    }
  };
  
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

  const navigateToRatingScreen = () => {
    navigation.navigate('EstablishmentRatingScreen', {
      id,
      liked: !isClickedLike,
      disliked: !isClickedDislike,
      establishmentInfo,
    });
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
              <TouchableOpacity
                onPress={navigateToRatingScreen}
                accessibilityHint="Clique para escrever uma resenha."
              >
                <Text
                  style={{
                    fontFamily: 'Oxygen-Bold',
                    fontSize: 15,
                    color: colors.textBlue,
                    textDecorationLine: 'underline',
                  }}
                >
                  Escreva uma resenha
                </Text>
              </TouchableOpacity>

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
              <View Style={isLoadingComments ? styles.loading : {}}>
                {isLoadingComments ? (
                  <LoaderComponent accessibilityLabel="Carregando lista de comentários" />
                ) : comments.length ? (
                  comments.slice(0, 3).map((comment, index) => (
                    <View key={index}>
                      <CommentComponent comment={comment}></CommentComponent>
                    </View>
                  ))
                ) : (
                  <View style={{ paddingTop: 16 }}>
                    <Text>
                      {comments.length === 0
                        ? 'Nenhum comentário encontrado'
                        : 'Nenhum comentário disponível no momento'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {establishmentInfo.createdByUser && (        
            <View style={{ marginTop: '3%' }}>
              <NavButtonComponent text={'Editar local'} img={'Edit'} />
              <NavButtonComponent onClick={() => handleDelete()} 
        text={'Indicar desativação'} 
        img={'Warning'} 
        textIsRed={true}/>
            </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.popUp}>
        <AvaliationPopUpComponent status={establishmentInfo.status} />
      </View>
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
    display: 'flex',
    width: '100%',
    position: 'relative',
  },

  screen: {
    width: '90%',
    display: 'flex',
  },

  disabilityTags: {
    justifyContent: 'center',
    alignItems: 'right',
    display: 'flex',
    width: '90%',
    marginTop: '2%',
  },

  tagDisplay: {
    justifyContent: 'space-between',
    maxHeight: '20%',
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popUp: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    position: 'absolute',
    bottom: '5%',
    width: '80%',
    left: '10%',
    backgroundColor: 'transparent',
  },
});
