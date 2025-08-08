import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SquareCheck as CheckSquare, CreditCard as Edit3, Trash2, User, Calendar, Clock, Bell, BellOff, History } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { ActivityStatus } from '@/types/app';
import { formatDate, formatDateTime, getDaysUntilDeadline, isOverdue } from '@/utils/dateUtils';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ActivityDetailsScreen() {
  const { 
    activities, 
    getPersonById, 
    updateActivityStatus, 
    deleteActivity, 
    refreshData 
  } = useApp();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const activity = activities.find(a => a.id === id);
  const person = activity ? getPersonById(activity.personId) : null;

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleStatusChange = async (newStatus: ActivityStatus) => {
    if (!activity) return;

    try {
      setUpdatingStatus(true);
      await updateActivityStatus(activity.id, newStatus);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar o status da atividade.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = () => {
    if (!activity) return;

    Alert.alert(
      'Excluir Atividade',
      `Tem certeza que deseja excluir "${activity.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deleteActivity(activity.id);
              router.back();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a atividade.');
            }
          }
        },
      ]
    );
  };

  if (!activity) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon={<CheckSquare size={48} color="#9CA3AF" />}
          title="Atividade não encontrada"
          description="Esta atividade pode ter sido removida"
          actionTitle="Voltar"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const deadline = new Date(activity.deadline);
  const daysUntil = getDaysUntilDeadline(deadline);
  const overdue = isOverdue(deadline);

  const statusOptions: { status: ActivityStatus; label: string; available: boolean }[] = [
    { status: 'pending', label: 'Pendente', available: true },
    { status: 'started', label: 'Iniciar', available: activity.status === 'pending' },
    { status: 'completed', label: 'Concluir', available: activity.status !== 'completed' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Voltar"
          onPress={() => router.back()}
          variant="secondary"
          size="small"
        />
        <Text style={styles.title}>Atividade</Text>
        <Button
          title="Editar"
          onPress={() => router.push(`/forms/activity?id=${activity.id}`)}
          variant="secondary"
          size="small"
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Activity Info */}
        <Card style={styles.card}>
          <View style={styles.activityHeader}>
            <View style={styles.titleSection}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <StatusBadge status={activity.status} />
            </View>
            <View style={styles.reminderIcon}>
              {activity.reminderEnabled ? (
                <Bell size={20} color="#2563EB" />
              ) : (
                <BellOff size={20} color="#9CA3AF" />
              )}
            </View>
          </View>

          {activity.description && (
            <Text style={styles.description}>{activity.description}</Text>
          )}

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <User size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Atribuída para</Text>
              <Text style={styles.infoValue}>{person?.name || 'Pessoa não encontrada'}</Text>
            </View>

            <View style={styles.infoItem}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Data de Início</Text>
              <Text style={styles.infoValue}>{formatDate(new Date(activity.startDate))}</Text>
            </View>

            <View style={styles.infoItem}>
              <Clock size={16} color={overdue ? '#DC2626' : '#6B7280'} />
              <Text style={styles.infoLabel}>Prazo Final</Text>
              <Text style={[styles.infoValue, overdue && styles.overdueText]}>
                {formatDate(deadline)}
              </Text>
              {overdue && activity.status !== 'completed' && (
                <Text style={styles.overdueLabel}>
                  Atrasada {Math.abs(daysUntil)} dia(s)
                </Text>
              )}
            </View>
          </View>
        </Card>

        {/* Status Actions */}
        {activity.status !== 'completed' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alterar Status</Text>
            <View style={styles.statusActions}>
              {statusOptions
                .filter(option => option.available)
                .map((option) => (
                  <Button
                    key={option.status}
                    title={option.label}
                    onPress={() => handleStatusChange(option.status)}
                    disabled={updatingStatus}
                    style={styles.statusButton}
                    variant={option.status === 'completed' ? 'success' : 'primary'}
                  />
                ))}
            </View>
          </View>
        )}

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico</Text>
          <Card style={styles.card}>
            {activity.history.length > 0 ? (
              <View style={styles.historyList}>
                {activity.history
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry, index) => (
                    <View key={entry.id} style={[
                      styles.historyItem,
                      index < activity.history.length - 1 && styles.historyItemBorder
                    ]}>
                      <View style={styles.historyHeader}>
                        <Text style={styles.historyAction}>{entry.action}</Text>
                        <Text style={styles.historyDate}>
                          {formatDateTime(new Date(entry.date))}
                        </Text>
                      </View>
                      {entry.observation && (
                        <Text style={styles.historyObservation}>
                          {entry.observation}
                        </Text>
                      )}
                    </View>
                  ))}
              </View>
            ) : (
              <EmptyState
                icon={<History size={24} color="#9CA3AF" />}
                title="Sem histórico"
                description="Ainda não há alterações registradas"
              />
            )}
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Card style={[styles.card, styles.dangerCard]}>
            <View style={styles.dangerContent}>
              <View style={styles.dangerInfo}>
                <Trash2 size={20} color="#DC2626" />
                <View>
                  <Text style={styles.dangerTitle}>Excluir Atividade</Text>
                  <Text style={styles.dangerDescription}>
                    Remove permanentemente esta atividade
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
  scrollView: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  reminderIcon: {
    padding: 4,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    flex: 1,
  },
  overdueText: {
    color: '#DC2626',
  },
  overdueLabel: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    marginTop: 2,
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
  statusActions: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
  },
  historyList: {
    gap: 1,
  },
  historyItem: {
    paddingVertical: 12,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyAction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  historyObservation: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
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