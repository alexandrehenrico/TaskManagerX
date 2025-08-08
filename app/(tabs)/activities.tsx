import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, SquareCheck as CheckSquare, Filter } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { ActivityCard } from '@/components/ActivityCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/Button';
import { ActivityStatus } from '@/types/app';
import { useRouter } from 'expo-router';

type FilterOption = 'all' | ActivityStatus;

export default function ActivitiesScreen() {
  const { activities, people, getPersonById, refreshData } = useApp();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredActivities = useMemo(() => {
    let filtered = activities;
    
    if (filter !== 'all') {
      filtered = filtered.filter(activity => activity.status === filter);
    }

    return filtered.sort((a, b) => {
      // Sort by status priority: overdue > pending > started > completed
      const statusPriority = { overdue: 4, pending: 3, started: 2, completed: 1 };
      const aPriority = statusPriority[a.status] || 0;
      const bPriority = statusPriority[b.status] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Then by deadline
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [activities, filter]);

  const filterOptions: { key: FilterOption; label: string; count: number }[] = [
    { key: 'all', label: 'Todas', count: activities.length },
    { key: 'pending', label: 'Pendentes', count: activities.filter(a => a.status === 'pending').length },
    { key: 'started', label: 'Iniciadas', count: activities.filter(a => a.status === 'started').length },
    { key: 'completed', label: 'Concluídas', count: activities.filter(a => a.status === 'completed').length },
    { key: 'overdue', label: 'Atrasadas', count: activities.filter(a => a.status === 'overdue').length },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const renderActivity = ({ item: activity }) => (
    <ActivityCard
      activity={activity}
      person={getPersonById(activity.personId)}
      onPress={() => router.push(`/details/activity/${activity.id}`)}
    />
  );

  const renderFilterOption = (option: { key: FilterOption; label: string; count: number }) => (
    <TouchableOpacity
      key={option.key}
      style={[
        styles.filterOption,
        filter === option.key && styles.activeFilterOption
      ]}
      onPress={() => {
        setFilter(option.key);
        setShowFilters(false);
      }}
    >
      <Text style={[
        styles.filterText,
        filter === option.key && styles.activeFilterText
      ]}>
        {option.label} ({option.count})
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Atividades</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
          <Button
            title="Adicionar"
            onPress={() => router.push('/forms/activity')}
            size="small"
            style={styles.addButton}
          />
        </View>
      </View>

      {/* Filter Options */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filters}>
            {filterOptions.map(renderFilterOption)}
          </View>
        </View>
      )}

      {/* Current Filter Info */}
      {filter !== 'all' && (
        <View style={styles.filterInfo}>
          <Text style={styles.filterInfoText}>
            Mostrando: {filterOptions.find(f => f.key === filter)?.label.toLowerCase()}
          </Text>
        </View>
      )}

      {filteredActivities.length > 0 ? (
        <FlatList
          data={filteredActivities}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon={<CheckSquare size={48} color="#9CA3AF" />}
          title={filter === 'all' ? 'Nenhuma atividade' : `Nenhuma atividade ${filterOptions.find(f => f.key === filter)?.label.toLowerCase()}`}
          description="Crie uma nova atividade para começar"
          actionTitle="Criar Atividade"
          onAction={() => router.push('/forms/activity')}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addButton: {
    paddingHorizontal: 20,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  filterInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  filterInfoText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 100,
  },
});