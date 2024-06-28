/**
 * Componente de NavButton
 *
 * @param text                Texto que será usado no botão
 * @param img                 É a imagem do icone que será utilizada no botão, ela pode ter três parâmetros: "Edit", "Shop" e "Warning"
 * @param onClick             Função chamada ao clicar no botão
 * @param textIsRed           O padrão é false, quando chamada como true, o texto e o icone da flecha indicadora mudam para vermelho
 *
 * @example                   <NavButtonComponent text='Editar perfil' img={'Edit"} textIsRed={false}/>
 *
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import EditIcon from '../../src/assets/icons/EditIcon.js';
import ShopIcon from '../../src/assets/icons/ShopIcon.js';
import WarningRedIcon from '../../src/assets/icons/WarningRedIcon.js';
import BlackArrowBackIcon from '../assets/icons/ArrowBackIcon.js';
import RedArrowBackIcon from '../../src/assets/icons/RedArrowBackIcon.js';
import colors from '../constants/colors.js';

export default function NavButtonComponent({
  text,
  img,
  onClick,
  textIsRed = false,
}) {
  return (
    <TouchableOpacity
      style={styles.component}
      accessibilityLabel={text}
      onPress={onClick}
    >
      <View style={styles.vector}>
        {img == 'Edit' && <EditIcon />}
        {img == 'Shop' && <ShopIcon />}
        {img == 'Warning' && <WarningRedIcon />}
      </View>
      <View>
        <Text style={textIsRed ? styles.textRed : img == 'Edit' ? styles.textBlackEdit : styles.textBlack}>
          {text}
        </Text>
      </View>
      <View style={styles.arrow}>
        {textIsRed ? <RedArrowBackIcon /> : <BlackArrowBackIcon />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  component: {
    minWidth: '100%',
    height: 52,
    backgroundColor: colors.backgroundScreen,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    borderTopColor: colors.borderStrokeOpacity,
    borderTopWidth: 1,
    position: 'relative',
  },

  vector: {
    position: 'absolute',
    left: 0,
    alignItems: 'left',
  },

  arrow: {
    position: 'absolute',
    right: 0,
    alignItems: 'right',
  },

  textBlack: {
    marginLeft: '15%',
    fontFamily: 'Oxygen-Bold',
    fontSize: 18,
    color: colors.textBlack
  },
  textBlackEdit: {
    marginLeft: '19%',
    fontFamily: 'Oxygen-Bold',
    fontSize: 18,
    color: colors.textBlack
  },

  textRed: {
    marginLeft: '17%',
    fontFamily: 'Oxygen-Bold',
    fontSize: 18,
    color: colors.error,
  },
});
