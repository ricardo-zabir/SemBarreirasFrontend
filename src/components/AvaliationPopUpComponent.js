import { StyleSheet, Text, Touchable, View } from 'react-native';
import WarningBlueIcon from '../assets/icons/WarningBlueIcon';
import XExitIcon from '../assets/icons/XExitIcon';
import React, { useEffect, useState } from 'react';
import fontlist from '../assets/fonts/fontlist';
import { TouchableOpacity } from 'react-native';

export default function AvaliationPopUpComponent({ status }) {
  const [visible, setVisible] = useState(true);
  

  useEffect(() => {
    if (status === 'PENDING') {
      setVisible(false);
    } else if (status === 'APPROVED') {
      setVisible(true);
    }
  }, [status]);

  function hide() {
    setVisible(!visible);
  }


  if(visible) return;

  return(
    <View style={styles.component}>
      <View style={styles.warning}>
        <WarningBlueIcon />
      </View>
      <Text style={styles.text}>Local em avaliação</Text>
      <View style={styles.exit}>
        <TouchableOpacity onPress={hide}>
        <XExitIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = new StyleSheet.create({
  component: {
    backgroundColor: '#EAD30A',
    flexDirection: 'row',
    width: '99%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: '100%'
    
  },
  warning: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: '1%',
  },

  exit: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: '1%',
    
    
  },
  text: {
    alignItems: 'center',
    fontFamily: 'Quicksand-Medium',
    fontSize: 15,
  },
});
