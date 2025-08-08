import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { PersonCard } from '@/components/PersonCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';

export default function PeopleScreen() {
  const { people, getActivitiesByPerson, refreshData } = useApp();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const renderPerson = ({ item: person }) => (
    <PersonCard
      person={person}
      activitiesCount={getActivitiesByPerson(person.id).length}
      onPress={() => router.push(`/details/person/${person.id}`)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pessoas</Text>
        <Button
          title="Adicionar"
          onPress={() => router.push('/forms/person')}
          size="small"
          style={styles.addButton}
        />
      </View>

      {people.length > 0 ? (
        <FlatList
          data={people}
          renderItem={renderPerson}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon={<Users size={48} color="#9CA3AF" />}
          title="Nenhuma pessoa cadastrada"
          description="Adicione pessoas para começar a atribuir atividades"
          actionTitle="Adicionar Primeira Pessoa"
          onAction={() => router.push('/forms/person')}
        />
      )}
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
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
});