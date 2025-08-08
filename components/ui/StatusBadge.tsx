import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityStatus } from '@/types/app';
import { getStatusColor, getStatusText } from '@/utils/dateUtils';

interface StatusBadgeProps {
  status: ActivityStatus;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'medium' 
}) => {
  const backgroundColor = getStatusColor(status);
  const text = getStatusText(status);

  return (
    <View style={[
      styles.badge,
      { backgroundColor },
      size === 'small' && styles.smallBadge
    ]}>
      <Text style={[
        styles.text,
        size === 'small' && styles.smallText
      ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  smallText: {
    fontSize: 10,
  },
});