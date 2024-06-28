/**
 * Componente de modelo que cria um botão
 * @param text             Texto principal do componente
 * @param onPress          Função para idar com o evento de pressionar o botão.
 * @param isBlue           Função que define qual a cor do botão
 * @param customWidth      Dica do que deve ser feito no campo: Apenas um dos botoes tem tamanho diferente, nesse momento utilizar
 * @example          <ButtonComponent
                      text="Cadastrar"
                      onPress={() => console.log('Botão Cadastrar Clicado')}
                      isBlue={true}
                      customWidth={200}
                      accessibilityLabel="Botão de Clique"
                      />
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';
import { fonts } from '../assets/fonts/fontlist';

export default function ButtonComponent({
  text,
  onPress,
  isBlue = false,
  customWidth,
  accessibilityLabel }) 
{

  const myWidth = customWidth ? customWidth : 300;

  return (
    <View width={myWidth}>
      <TouchableOpacity style={isBlue ? styles.buttonBlue : styles.buttonWhite} onPress={onPress} accessibilityLabel={accessibilityLabel}>
        <Text style={isBlue ? styles.buttonTextWhite : styles.buttonTextBlue}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWhite: {
    alignItems: 'center',
    backgroundColor: colors.backgroundScreen,
    padding: 10,
    borderRadius: 5,
    borderColor: colors.blue,
    borderWidth: 3,
  },
  buttonBlue: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
    borderColor: colors.blue,
    borderWidth: 3,
  },
  buttonTextBlue: {
    color: colors.textBlue,
    fontFamily: 'Oxygen-Bold',
    fontSize: 18,
  },
  buttonTextWhite: {
    color: colors.backgroundScreen,
    fontFamily: 'Oxygen-Bold',
    fontSize: 18,
  }
});
