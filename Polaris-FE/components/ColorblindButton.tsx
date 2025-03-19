import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useTheme from '@/hooks/useTheme';
import { CustomTheme, themes } from '@/utils/themeOptions';
import styles from './Styles/ColorblindButton';

interface ThemeOptionProps {
  themeKey: string;
  label: string;
  icon: string;
  onSelect: (theme: CustomTheme) => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
  themeKey,
  label,
  icon,
  onSelect,
}) => (
  <TouchableOpacity
    style={styles.optionButton}
    onPress={() => onSelect(themes[themeKey])}
  >
    <Text style={styles.optionText}>
      {icon} {label}
    </Text>
  </TouchableOpacity>
);

export function ColorblindButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const { setTheme } = useTheme();

  const toggleModal = () => setModalVisible(!modalVisible);

  const themeOptions = [
    { key: 'default', label: 'Default', icon: '🔵' },
    { key: 'deuteranopia', label: 'Deuteranopia (Green Weakness)', icon: '🟠' },
    { key: 'protanopia', label: 'Protanopia (Red Weakness)', icon: '🟢' },
    {
      key: 'tritanopia',
      label: 'Tritanopia (Blue-Yellow Deficiency)',
      icon: '🔴',
    },
  ];

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>🎨 Mode</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Colorblind Mode</Text>
            {themeOptions.map(({ key, label, icon }) => (
              <ThemeOption
                key={key}
                themeKey={key}
                label={label}
                icon={icon}
                onSelect={(theme: CustomTheme) => {
                  setTheme(theme);
                  toggleModal();
                }}
              />
            ))}
            <TouchableOpacity
              style={[styles.optionButton, styles.cancelButton]}
              onPress={toggleModal}
            >
              <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
