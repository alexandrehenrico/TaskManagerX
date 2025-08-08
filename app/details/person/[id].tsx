import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, CreditCard as Edit3, Trash2, SquareCheck as CheckSquare, Phone, Mail } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ActivityCard } from '@/components/ActivityCard';
import { EmptyState } from '@/components/EmptyState';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PersonDetailsScreen() {
  const { people, getActivitiesByPerson, deletePerson, refreshData } = useApp();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const person = people.find(p => p.id === id);
  const personActivities = person ? getActivitiesByPerson(person.id) : [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleDelete = () => {
    if (!person) return;

    Alert.alert(
      'Excluir Pessoa',
      `Tem certeza que deseja excluir "${person.name}"? Todas as atividades atribuídas também serão removidas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deletePerson(person.id);
              router.back();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a pessoa.');
            }
          }
        },
      ]
    );
  };

  if (!person) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon={<User size={48} color="#9CA3AF" />}
          title="Pessoa não encontrada"
          description="Esta pessoa pode ter sido removida"
          actionTitle="Voltar"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Voltar"
          onPress={() => router.back()}
          variant="secondary"
          size="small"
        />
        <Text style={styles.title}>Detalhes</Text>
        <View style={styles.headerActions}>
          <Button
            title="Editar"
            onPress={() => router.push(`/forms/person?id=${person.id}`)}
            variant="secondary"
            size="small"
            style={styles.editButton}
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Person Info */}
        <Card style={styles.card}>
          <View style={styles.personHeader}>
            <View style={styles.photoContainer}>
              {person.profilePhoto ? (
                <Image 
                  source={{ uri: person.profilePhoto }} 
                  style={styles.photo}
                />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <User size={40} color="#9CA3AF" />
                </View>
              )}
            </View>
            
            <View style={styles.personInfo}>
              <Text style={styles.personName}>{person.name}</Text>
              <Text style={styles.personPosition}>{person.position}</Text>
              
              {person.contact && (
                <View style={styles.contactRow}>
                  <Phone size={16} color="#6B7280" />
                  <Text style={styles.contactText}>{person.contact}</Text>
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <CheckSquare size={24} color="#2563EB" />
              <Text style={styles.statNumber}>{personActivities.length}</Text>
              <Text style={styles.statLabel}>Atividades Atribuídas</Text>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <CheckSquare size={24} color="#059669" />
              <Text style={styles.statNumber}>
                {personActivities.filter(a => a.status === 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
          </Card>
        </View>

        {/* Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividades</Text>
          
          {personActivities.length > 0 ? (
            <View style={styles.activitiesContainer}>
              {personActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  person={person}
                  onPress={() => router.push(`/details/activity/${activity.id}`)}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon={<CheckSquare size={32} color="#9CA3AF" />}
              title="Nenhuma atividade"
              description="Esta pessoa ainda não possui atividades atribuídas"
              actionTitle="Criar Atividade"
              onAction={() => router.push(`/forms/activity?personId=${person.id}`)}
            />
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Card style={[styles.card, styles.dangerCard]}>
            <View style={styles.dangerContent}>
              <View style={styles.dangerInfo}>
                <Trash2 size={20} color="#DC2626" />
                <View>
                  <Text style={styles.dangerTitle}>Excluir Pessoa</Text>
                  <Text style={styles.dangerDescription}>
                    Remove a pessoa e todas as atividades atribuídas
                  </Text>
                </View>
              </View>
              <Button
                title="Excluir"
                onPress={handleDelete}
                variant="danger"
                size="small"
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoContainer: {
    marginRight: 16,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  personPosition: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  activitiesContainer: {
    marginHorizontal: -16,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  dangerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dangerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#991B1B',
    marginLeft: 8,
    marginTop: 2,
  },
});