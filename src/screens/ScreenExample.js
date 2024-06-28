/**
 * Screen de exemplo com um componente de exemplo
 *
 * @example           <ScreenExample/>
 */

import React from 'react';
import { StyleSheet, View, Alert, Button } from 'react-native';

import colors from '../constants/colors';

import ImgDescriptionComponent from '../components/ImgDescriptionComponent';
import { ScrollView } from 'react-native-gesture-handler';

export default function ScreenExample() {
  /**
   * Exemplo de uso do componente ImgDescriptionComponent
   */

  const [images, setImages] = React.useState([
    { image: null, description: '' },
    { image: null, description: '' },
    { image: null, description: '' },
    { image: null, description: '' },
    { image: null, description: '' },
  ]);
  const [errors, setErrors] = React.useState(Array(5).fill(''));

  // Casos de erro
  const validateFields = (items) => {
    const newErrors = Array(5).fill('');
    items.forEach((item, index) => {
      if (!item.image) {
        newErrors[index] = 'Por favor, insira uma imagem.';
      }
      if (item.image && !item.description.trim()) {
        newErrors[index] = 'Por favor, insira uma descrição.';
      }
    });
    setErrors(newErrors);
    return newErrors.every(error => error === '');
  };

  const handleImageChange = (image, index) => {
    setImages(image);
    const newErrors = [...errors]; // Atualiza erros
    newErrors[index] = '';
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (validateFields(images)) {
      const formData = new FormData();
      images.forEach((item, index) => {
        if (item.image) {
          formData.append(`image_${index}`, {
            uri: item.image.uri,
            name: item.image.name,
            type: item.image.type,
            description: item.description,
          });
        }
      });
      printFormData(formData);
    }
  };

  // Função auxiliar para imprimir o conteúdo do FormData
  const printFormData = (formData) => {
    for (let pair of formData._parts) {
      console.log(`${pair[0]}: ${JSON.stringify(pair[1])}`);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={{ maxHeight: '80%', width: '100%' }}>
        <ImgDescriptionComponent
          accessibilityLabel='Descrição*'
          placeholder='Descrição*'
          images={images}
          onImageChange={handleImageChange}
          errors={errors}
        />
      </ScrollView>
      <Button title="Enviar" onPress={handleSubmit} />
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundScreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
