/**
 * ✨ FADE MODAL COMPONENT
 * 
 * Smooth fade transitions för modaler med Figma Design System
 */

import React, { useEffect, useRef } from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  Animated, 
  TouchableWithoutFeedback,
  Dimensions 
} from 'react-native';
import { DesignTokens } from '../design-system/components';

interface FadeModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationDuration?: number;
  backdropOpacity?: number;
  closeOnBackdrop?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const FadeModal: React.FC<FadeModalProps> = ({
  visible,
  onClose,
  children,
  animationDuration = 600, // Långsammare fade som Mike ville
  backdropOpacity = 0.8,   // Mindre genomskinlig
  closeOnBackdrop = true,
}) => {
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    if (visible) {
      // Fade in animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration * 0.8, // Faster fade out
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: animationDuration * 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim, animationDuration]);
  
  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none" // We handle animation manually
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[
          styles.backdrop,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.90], // Ökad backdrop opacity för mer kontrast
            }),
          }
        ]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <Animated.View style={[
                styles.modalContent,
                {
                  transform: [
                    {
                      scale: scaleAnim
                    },
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0], // Slide up slightly
                      })
                    }
                  ]
                }
              ]}>
                {children}
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000',  // Solid svart istället för rgba
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing.lg,
  },
  
  modalContainer: {
    // Container bara för positioning, ingen styling
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: '#FFFFFF',  // Helt solid vit bakgrund
    borderRadius: DesignTokens.radius.xl,
    padding: DesignTokens.spacing.xl,
    maxWidth: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    minWidth: screenWidth * 0.8,
    // Större shadow för bättre definition
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    // Extra säkerhet för solid bakgrund - INGEN animation på denna
    opacity: 1.0,  // Force helt solid, aldrig animerad
    borderWidth: 2,  // Tjockare border
    borderColor: '#CCCCCC',  // Mer synlig border för definition
  },
});

export default FadeModal;