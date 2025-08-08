import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { User, Phone } from 'lucide-react-native';
import { Person } from '@/types/app';
import { Card } from './ui/Card';

interface PersonCardProps {
  person: Person;
  onPress: () => void;
  activitiesCount?: number;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  person,
  onPress,
  activitiesCount = 0,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.content}>
          <View style={styles.photoContainer}>
            {person.profilePhoto ? (
              <Image 
                source={{ uri: person.profilePhoto }} 
                style={styles.photo}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <User size={24} color="#9CA3AF" />
              </View>
            )}
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {person.name}
            </Text>
            <Text style={styles.position} numberOfLines={1}>
              {person.position}
            </Text>
            
            {person.contact && (
              <View style={styles.contactRow}>
                <Phone size={12} color="#6B7280" />
                <Text style={styles.contact} numberOfLines={1}>
                  {person.contact}
                </Text>
              </View>
            )}

            <Text style={styles.activitiesCount}>
              {activitiesCount} atividade(s) atribuída(s)
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoContainer: {
    marginRight: 16,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contact: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  activitiesCount: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '500',
  },
});