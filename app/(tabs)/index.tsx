import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Users, SquareCheck as CheckSquare, TriangleAlert as AlertTriangle, Plus } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ActivityCard } from '@/components/ActivityCard';
import { EmptyState } from '@/components/EmptyState';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const { 
    company, 
    people, 
    activities, 
    settings,
    getOverdueActivities,
    getTodayActivities,
    refreshData,
    loading,
    getPersonById,
  } = useApp();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const overdueActivities = getOverdueActivities();
  const todayActivities = getTodayActivities();
  const recentActivities = activities
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  // Redirect to setup if not initialized
  useEffect(() => {
    if (!loading && !settings.initialized) {
      router.replace('/setup/company');
    }
  }, [loading, settings.initialized]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!settings.initialized) {
    return null; // Will redirect to setup
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bom dia!</Text>
            <Text style={styles.companyName}>{company?.name}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Users size={24} color="#2563EB" />
              <Text style={styles.statNumber}>{people.length}</Text>
              <Text style={styles.statLabel}>Pessoas</Text>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <CheckSquare size={24} color="#059669" />
              <Text style={styles.statNumber}>{activities.length}</Text>
              <Text style={styles.statLabel}>Atividades</Text>
            </View>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, styles.warningCard]}>
            <View style={styles.statContent}>
              <AlertTriangle size={24} color="#D97706" />
              <Text style={styles.statNumber}>{todayActivities.length}</Text>
              <Text style={styles.statLabel}>Vencem Hoje</Text>
            </View>
          </Card>

          <Card style={[styles.statCard, styles.dangerCard]}>
            <View style={styles.statContent}>
              <AlertTriangle size={24} color="#DC2626" />
              <Text style={styles.statNumber}>{overdueActivities.length}</Text>
              <Text style={styles.statLabel}>Atrasadas</Text>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <Button
              title="Nova Pessoa"
              onPress={() => router.push('/forms/person')}
              style={styles.quickActionButton}
              size="small"
            />
            <Button
              title="Nova Atividade"
              onPress={() => router.push('/forms/activity')}
              style={styles.quickActionButton}
              size="small"
            />
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atividades Recentes</Text>
            <Button
              title="Ver Todas"
              onPress={() => router.push('/(tabs)/activities')}
              variant="secondary"
              size="small"
            />
          </View>

          {recentActivities.length > 0 ? (
            <View style={styles.activitiesContainer}>
              {recentActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  person={getPersonById(activity.personId)}
                  onPress={() => router.push(`/details/activity/${activity.id}`)}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon={<CheckSquare size={32} color="#9CA3AF" />}
              title="Nenhuma atividade"
              description="Crie sua primeira atividade para começar"
              actionTitle="Criar Atividade"
              onAction={() => router.push('/forms/activity')}
            />
          )}
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
  },
  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
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
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
  },
  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
  },
  activitiesContainer: {
    marginHorizontal: -16,
  },
});