/**
 * @param comment                Define o objeto a ser passado pro componente.
 * @example            const comment = {
 *                      userName: 'Bananaaaaaaaaaaaaaaaaaaaa',
 *                      rating: 'L',
 *                      date: '02/02/2002',
 *                      content: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
 *                     }
 *                 <CommentComponent comment={comment}
 *                   />
 */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';
import fontlist from '../assets/fonts/fontlist';

export default function CommentComponent({ comment }) {
  const { id, userName, content, rating, date } = comment;
  const isAccessible = comment.rating === 'L' ? true : false; // true para "Achou acessível", false para "Não achou acessível"
  const accessibilityText = isAccessible
    ? 'Achou acessível'
    : 'Não achou acessível';
  const iconName = isAccessible ? 'thumb-up' : 'thumb-down';
  const iconTextColor = isAccessible ? colors.blue : colors.backgroundSearchBar; // Definindo a cor do texto e do icone

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/imgs/Avatar.png')}
        style={styles.avatar}
        accessibilityLabel="Avatar do Usuário"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text
              style={styles.userName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {comment.userName}
            </Text>
            <Text style={styles.date}>{comment.date}</Text>
          </View>
          <View style={styles.likeContainer}>
            <Text style={[styles.likeText, { color: iconTextColor }]}>
              {accessibilityText}
            </Text>
            <Icon name={iconName} size={20} color={iconTextColor} />
          </View>
        </View>
        <View>
          <Text style={styles.text} numberOfLines={3} ellipsizeMode="tail">
            {comment.content}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '90%',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginTop: 15,
  },
  content: {
    marginLeft: 10,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'column',
    maxWidth: 150,
    marginTop: 15,
  },
  userName: {
    fontFamily: 'Oxygen-Bold',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20.2,
    textAlign: 'left',
    color: colors.textBlack,
  },
  date: {
    color: colors.textBlack,
    fontSize: 12,
    lineHeight: 15.15,
    fontWeight: '400',
    marginTop: 2,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  likeText: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 17.68,
    marginRight: 5,
  },
  text: {
    fontFamily: 'Oxygen-Light',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17.68,
    textAlign: 'left',
    color: colors.textBlack,
    marginTop: 5,
  },
});
