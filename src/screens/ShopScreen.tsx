import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CoinBadge } from '../components/CoinBadge';
import { useGame } from '../context/GameContext';
import { SHOP_ITEMS } from '../content/items';
import { ShopItem } from '../logic/types';
import { Palette, Radii, Spacing } from '../theme/colors';

interface ShopScreenProps {
  onGoToTasks: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({ onGoToTasks }) => {
  const { state, purchaseItem } = useGame();
  const { balance } = state;

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mandatory' | 'optional'>('all');
  const [confirmingItem, setConfirmingItem] = useState<ShopItem | null>(null);

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleBuyClick = (item: ShopItem) => {
    setConfirmingItem(item);
  };

  const handleConfirmPurchase = () => {
    if (!confirmingItem) return;
    const item = confirmingItem;
    setConfirmingItem(null);
    purchaseItem(item);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Магазин для Финни 🛒</Text>
        <Text style={styles.screenSubtitle}>
          Обязательный корм и весёлые игрушки для питомца
        </Text>

        {/* Доступный баланс */}
        <View style={styles.balanceRow}>
          <CoinBadge amount={balance} label="Твой баланс" size="lg" />
        </View>

        {/* Фильтр категорий */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              selectedCategory === 'all' && styles.filterBtnActive,
            ]}
            onPress={() => setSelectedCategory('all')}>
            <Text
              style={[
                styles.filterText,
                selectedCategory === 'all' && styles.filterTextActive,
              ]}>
              Все товары
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              selectedCategory === 'mandatory' && styles.filterBtnActiveNeeds,
            ]}
            onPress={() => setSelectedCategory('mandatory')}>
            <Text
              style={[
                styles.filterText,
                selectedCategory === 'mandatory' && styles.filterTextActiveNeeds,
              ]}>
              🍏 Нужно (Обязательное)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              selectedCategory === 'optional' && styles.filterBtnActiveWants,
            ]}
            onPress={() => setSelectedCategory('optional')}>
            <Text
              style={[
                styles.filterText,
                selectedCategory === 'optional' && styles.filterTextActiveWants,
              ]}>
              🎈 Хочу (Желания)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Список товаров */}
        <View style={styles.itemsGrid}>
          {filteredItems.map((item) => {
            const isNeeds = item.category === 'mandatory';
            const canBuy = balance >= item.price;

            return (
              <View
                key={item.id}
                style={[
                  styles.itemCard,
                  { borderColor: isNeeds ? Palette.needsLight : Palette.wantsLight },
                ]}>
                {/* Бейдж категории */}
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: isNeeds ? Palette.needsLight : Palette.wantsLight },
                  ]}>
                  <Text
                    style={[
                      styles.categoryBadgeText,
                      { color: isNeeds ? Palette.needsDark : Palette.wantsDark },
                    ]}>
                    {isNeeds ? '🍏 Нужно' : '🎈 Хочу'}
                  </Text>
                </View>

                {/* Иконка товара */}
                <View style={styles.itemIconBox}>
                  <Text style={{ fontSize: 36 }}>{item.icon}</Text>
                </View>

                {/* Название и описание */}
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>

                {/* Эффект на питомца */}
                <View style={styles.effectsRow}>
                  {item.hungerBonus > 0 && (
                    <Text style={styles.effectTag}>🍗 +{item.hungerBonus}%</Text>
                  )}
                  {item.moodBonus > 0 && (
                    <Text style={styles.effectTag}>🎮 +{item.moodBonus}%</Text>
                  )}
                  {item.careBonus > 0 && (
                    <Text style={styles.effectTag}>🧼 +{item.careBonus}%</Text>
                  )}
                </View>

                {/* Цена и кнопка покупки */}
                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>{item.price} 🪙</Text>
                  <TouchableOpacity
                    style={[
                      styles.buyButton,
                      !canBuy && styles.buyButtonShort,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleBuyClick(item)}>
                    <Text style={styles.buyButtonText}>
                      {canBuy ? 'Купить' : 'Купить (не хватает)'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Модальное подтверждение покупки */}
        {confirmingItem && (
          <Modal transparent animationType="fade" visible={!!confirmingItem}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <Text style={{ fontSize: 44, marginBottom: 8 }}>{confirmingItem.icon}</Text>
                <Text style={styles.modalTitle}>Подтверди покупку</Text>
                <Text style={styles.modalItemName}>{confirmingItem.name}</Text>

                <View style={styles.modalInfoBox}>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalRowLabel}>Стоимость:</Text>
                    <Text style={styles.modalRowVal}>{confirmingItem.price} 🪙</Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalRowLabel}>Категория:</Text>
                    <Text
                      style={[
                        styles.modalRowVal,
                        {
                          color:
                            confirmingItem.category === 'mandatory'
                              ? Palette.needsDark
                              : Palette.wantsDark,
                        },
                      ]}>
                      {confirmingItem.categoryName}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalRowLabel}>Останется монет:</Text>
                    <Text style={[styles.modalRowVal, { color: Palette.primaryDark }]}>
                      {Math.max(0, balance - confirmingItem.price)} 🪙
                    </Text>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalConfirmBtn}
                    activeOpacity={0.85}
                    onPress={handleConfirmPurchase}>
                    <Text style={styles.modalConfirmBtnText}>Да, покупаем! 🛍️</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    activeOpacity={0.7}
                    onPress={() => setConfirmingItem(null)}>
                    <Text style={styles.modalCancelBtnText}>Отмена</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgMain,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 90,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Palette.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  balanceRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
  },
  filterBtn: {
    flex: 1,
    backgroundColor: Palette.bgCard,
    paddingVertical: 10,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Palette.border,
    minHeight: 44,
    justifyContent: 'center',
  },
  filterBtnActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primaryLight,
  },
  filterBtnActiveNeeds: {
    borderColor: Palette.needs,
    backgroundColor: Palette.needsLight,
  },
  filterBtnActiveWants: {
    borderColor: Palette.wants,
    backgroundColor: Palette.wantsLight,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
    textAlign: 'center',
  },
  filterTextActive: {
    color: Palette.primaryDark,
    fontWeight: '800',
  },
  filterTextActiveNeeds: {
    color: Palette.needsDark,
    fontWeight: '800',
  },
  filterTextActiveWants: {
    color: Palette.wantsDark,
    fontWeight: '800',
  },
  itemsGrid: {
    gap: Spacing.md,
  },
  itemCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  itemIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.bgCardSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 4,
    maxWidth: '75%',
  },
  itemDescription: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  effectsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  effectTag: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primaryDark,
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingTop: 10,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: Palette.goldDark,
  },
  buyButton: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radii.md,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonShort: {
    backgroundColor: Palette.warning,
  },
  buyButtonText: {
    color: Palette.textWhite,
    fontSize: 13,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  modalItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  modalInfoBox: {
    width: '100%',
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: 8,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalRowLabel: {
    fontSize: 13,
    color: Palette.textSecondary,
    fontWeight: '600',
  },
  modalRowVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  modalButtons: {
    width: '100%',
    gap: Spacing.sm,
  },
  modalConfirmBtn: {
    backgroundColor: Palette.primary,
    paddingVertical: 14,
    borderRadius: Radii.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  modalConfirmBtnText: {
    color: Palette.textWhite,
    fontSize: 15,
    fontWeight: '800',
  },
  modalCancelBtn: {
    backgroundColor: Palette.bgCardSubtle,
    paddingVertical: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    color: Palette.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
});
