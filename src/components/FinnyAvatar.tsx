import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PetAccessory, PetColor, PetEmotion, PetSpecies, PetStage } from '../logic/types';
import { Palette, Radii } from '../theme/colors';

interface FinnyAvatarProps {
  species?: PetSpecies;
  color?: PetColor;
  accessory?: PetAccessory;
  stage?: PetStage;
  emotion?: PetEmotion;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showStageBadge?: boolean;
}

export const FinnyAvatar: React.FC<FinnyAvatarProps> = ({
  species = 'fox',
  color = 'orange',
  accessory = 'none',
  stage = 1,
  emotion = 'happy',
  size = 'md',
  showStageBadge = false,
}) => {
  // Вычисляем масштаб
  const scale = size === 'sm' ? 0.4 : size === 'md' ? 0.75 : size === 'lg' ? 1.0 : 1.35;
  const containerDim = 160 * scale;

  // Цветовая схема
  const colorMap: Record<PetColor, { body: string; dark: string; belly: string; accent: string }> = {
    orange: {
      body: '#FF7A00',
      dark: '#E06500',
      belly: '#FFF0DE',
      accent: '#FFB703',
    },
    teal: {
      body: '#00A896',
      dark: '#028090',
      belly: '#E6F7F5',
      accent: '#05F140',
    },
    purple: {
      body: '#8B5CF6',
      dark: '#6D28D9',
      belly: '#F3E8FF',
      accent: '#C084FC',
    },
  };

  const c = colorMap[color] || colorMap.orange;

  return (
    <View style={[styles.wrapper, { width: containerDim, height: containerDim }]}>
      {/* Аура для Мастера (Стадия 3) */}
      {stage === 3 && (
        <View
          style={[
            styles.masterAura,
            {
              width: containerDim * 1.15,
              height: containerDim * 1.15,
              borderRadius: containerDim,
            },
          ]}
        />
      )}

      <View style={[styles.avatarBox, { transform: [{ scale }] }]}>
        {/* Ушки в зависимости от вида */}
        {species === 'fox' && (
          <View style={styles.earsRow}>
            <View style={[styles.foxEarLeft, { backgroundColor: c.dark }]}>
              <View style={[styles.earInner, { backgroundColor: c.belly }]} />
            </View>
            <View style={[styles.foxEarRight, { backgroundColor: c.dark }]}>
              <View style={[styles.earInner, { backgroundColor: c.belly }]} />
            </View>
          </View>
        )}

        {species === 'cat' && (
          <View style={styles.earsRow}>
            <View style={[styles.catEarLeft, { backgroundColor: c.body }]}>
              <View style={[styles.catEarInner, { backgroundColor: '#FFD1DC' }]} />
            </View>
            <View style={[styles.catEarRight, { backgroundColor: c.body }]}>
              <View style={[styles.catEarInner, { backgroundColor: '#FFD1DC' }]} />
            </View>
          </View>
        )}

        {species === 'dragon' && (
          <View style={styles.earsRow}>
            <View style={[styles.dragonHornLeft]}>
              <Text style={{ fontSize: 24 }}>⚡</Text>
            </View>
            <View style={[styles.dragonEarLeft, { backgroundColor: c.dark }]} />
            <View style={[styles.dragonEarRight, { backgroundColor: c.dark }]} />
            <View style={[styles.dragonHornRight]}>
              <Text style={{ fontSize: 24 }}>⚡</Text>
            </View>
          </View>
        )}

        {/* Тело питомца */}
        <View style={[styles.body, { backgroundColor: c.body }]}>
          {/* Пузико */}
          <View style={[styles.belly, { backgroundColor: c.belly }]} />

          {/* Глаза по эмоции */}
          <View style={styles.eyesRow}>
            {emotion === 'happy' && (
              <>
                <View style={styles.eyeHappy}>
                  <Text style={styles.eyeTextHappy}>^</Text>
                </View>
                <View style={styles.eyeHappy}>
                  <Text style={styles.eyeTextHappy}>^</Text>
                </View>
              </>
            )}
            {emotion === 'neutral' && (
              <>
                <View style={styles.eyeRound}>
                  <View style={styles.eyePupil} />
                </View>
                <View style={styles.eyeRound}>
                  <View style={styles.eyePupil} />
                </View>
              </>
            )}
            {emotion === 'sad' && (
              <>
                <View style={styles.eyeRound}>
                  <View style={[styles.eyePupil, { transform: [{ translateY: 3 }] }]} />
                  <View style={styles.eyebrowSadLeft} />
                </View>
                <View style={styles.eyeRound}>
                  <View style={[styles.eyePupil, { transform: [{ translateY: 3 }] }]} />
                  <View style={styles.eyebrowSadRight} />
                </View>
              </>
            )}
          </View>

          {/* Носик и мордочка */}
          <View style={styles.noseRow}>
            <View style={styles.nose} />
          </View>

          {/* Ротик */}
          <View style={styles.mouthRow}>
            {emotion === 'happy' ? (
              <View style={styles.mouthHappy}>
                <View style={styles.tongue} />
              </View>
            ) : emotion === 'sad' ? (
              <View style={styles.mouthSad} />
            ) : (
              <View style={styles.mouthNeutral} />
            )}
          </View>

          {/* Румянец */}
          <View style={styles.cheeksRow}>
            <View style={styles.blush} />
            <View style={styles.blush} />
          </View>

          {/* Аксессуары */}
          {accessory === 'glasses' && (
            <View style={styles.glassesContainer}>
              <View style={styles.glassesLens} />
              <View style={styles.glassesBridge} />
              <View style={styles.glassesLens} />
            </View>
          )}

          {accessory === 'scarf' && (
            <View style={styles.scarfContainer}>
              <View style={styles.scarfNeck} />
              <View style={styles.scarfTail} />
            </View>
          )}

          {accessory === 'cap' && (
            <View style={styles.capContainer}>
              <View style={styles.capDome} />
              <View style={styles.capVisor} />
            </View>
          )}

          {accessory === 'bandana' && (
            <View style={styles.bandanaContainer}>
              <View style={styles.bandanaTriangle} />
            </View>
          )}

          {/* Стадия 3: Золотой медальон финансиста */}
          {stage === 3 && (
            <View style={styles.masterMedal}>
              <Text style={{ fontSize: 16 }}>🏅</Text>
            </View>
          )}

          {/* Стадия 2: Рюкзак юниора (лямки) */}
          {stage === 2 && (
            <View style={styles.juniorStrap}>
              <Text style={{ fontSize: 14 }}>🎒</Text>
            </View>
          )}

          {/* Стадия 1: Значок малыша */}
          {stage === 1 && (
            <View style={styles.babyBadge}>
              <Text style={{ fontSize: 14 }}>✨</Text>
            </View>
          )}
        </View>

        {/* Хвостик сзади */}
        <View style={[styles.tail, { backgroundColor: c.dark }]}>
          <View style={[styles.tailTip, { backgroundColor: c.belly }]} />
        </View>
      </View>

      {/* Бейдж стадии при необходимости */}
      {showStageBadge && (
        <View style={styles.stageBadgeContainer}>
          <Text style={styles.stageBadgeText}>
            {stage === 1 ? '👶 Малыш' : stage === 2 ? '🎒 Юниор' : '👑 Мастер'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  masterAura: {
    position: 'absolute',
    backgroundColor: 'rgba(251, 191, 36, 0.25)',
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  avatarBox: {
    width: 150,
    height: 160,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  body: {
    width: 110,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  belly: {
    position: 'absolute',
    bottom: 4,
    width: 68,
    height: 54,
    borderRadius: 34,
  },
  earsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 110,
    position: 'absolute',
    top: -16,
    zIndex: 1,
  },
  foxEarLeft: {
    width: 38,
    height: 44,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 8,
    transform: [{ rotate: '-18deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  foxEarRight: {
    width: 38,
    height: 44,
    borderTopRightRadius: 28,
    borderTopLeftRadius: 8,
    transform: [{ rotate: '18deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  earInner: {
    width: 18,
    height: 24,
    borderRadius: 9,
  },
  catEarLeft: {
    width: 34,
    height: 34,
    borderTopLeftRadius: 20,
    transform: [{ rotate: '-15deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEarRight: {
    width: 34,
    height: 34,
    borderTopRightRadius: 20,
    transform: [{ rotate: '15deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEarInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dragonHornLeft: {
    position: 'absolute',
    top: -12,
    left: 8,
    zIndex: 3,
  },
  dragonHornRight: {
    position: 'absolute',
    top: -12,
    right: 8,
    zIndex: 3,
  },
  dragonEarLeft: {
    width: 30,
    height: 30,
    borderRadius: 15,
    transform: [{ rotate: '-30deg' }],
  },
  dragonEarRight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    transform: [{ rotate: '30deg' }],
  },
  eyesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 58,
    marginTop: 8,
    zIndex: 2,
  },
  eyeHappy: {
    width: 20,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeTextHappy: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
  },
  eyeRound: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  eyePupil: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#1E293B',
  },
  eyebrowSadLeft: {
    position: 'absolute',
    top: -6,
    width: 12,
    height: 3,
    backgroundColor: '#1E293B',
    transform: [{ rotate: '20deg' }],
  },
  eyebrowSadRight: {
    position: 'absolute',
    top: -6,
    width: 12,
    height: 3,
    backgroundColor: '#1E293B',
    transform: [{ rotate: '-20deg' }],
  },
  noseRow: {
    marginTop: 3,
    zIndex: 2,
  },
  nose: {
    width: 9,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E293B',
  },
  mouthRow: {
    marginTop: 2,
    zIndex: 2,
  },
  mouthHappy: {
    width: 18,
    height: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#DC2626',
    overflow: 'hidden',
    alignItems: 'center',
  },
  tongue: {
    width: 12,
    height: 8,
    backgroundColor: '#FDA4AF',
    borderRadius: 6,
    position: 'absolute',
    bottom: -2,
  },
  mouthSad: {
    width: 14,
    height: 6,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    borderColor: '#1E293B',
    borderBottomWidth: 0,
  },
  mouthNeutral: {
    width: 10,
    height: 2,
    backgroundColor: '#1E293B',
    borderRadius: 1,
  },
  cheeksRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 78,
    top: 48,
    zIndex: 2,
  },
  blush: {
    width: 14,
    height: 8,
    borderRadius: 7,
    backgroundColor: 'rgba(244, 63, 94, 0.45)',
  },
  tail: {
    position: 'absolute',
    right: -14,
    bottom: 8,
    width: 36,
    height: 24,
    borderRadius: 12,
    transform: [{ rotate: '-25deg' }],
    zIndex: 0,
    overflow: 'hidden',
  },
  tailTip: {
    position: 'absolute',
    right: 0,
    width: 14,
    height: 24,
    borderRadius: 7,
  },
  glassesContainer: {
    position: 'absolute',
    top: 24,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 4,
  },
  glassesLens: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#1E293B',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  glassesBridge: {
    width: 8,
    height: 3,
    backgroundColor: '#1E293B',
  },
  scarfContainer: {
    position: 'absolute',
    bottom: 4,
    zIndex: 4,
    alignItems: 'center',
  },
  scarfNeck: {
    width: 70,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#B91C1C',
  },
  scarfTail: {
    position: 'absolute',
    right: 12,
    top: 10,
    width: 14,
    height: 26,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    transform: [{ rotate: '12deg' }],
  },
  capContainer: {
    position: 'absolute',
    top: -14,
    zIndex: 4,
    alignItems: 'center',
  },
  capDome: {
    width: 60,
    height: 28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#3B82F6',
  },
  capVisor: {
    width: 68,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1D4ED8',
    marginTop: -3,
  },
  bandanaContainer: {
    position: 'absolute',
    bottom: 2,
    zIndex: 4,
    alignItems: 'center',
  },
  bandanaTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#EF4444',
    transform: [{ rotate: '180deg' }],
  },
  masterMedal: {
    position: 'absolute',
    bottom: -6,
    zIndex: 5,
  },
  juniorStrap: {
    position: 'absolute',
    bottom: 4,
    right: 10,
    zIndex: 5,
  },
  babyBadge: {
    position: 'absolute',
    top: 4,
    right: 12,
    zIndex: 5,
  },
  stageBadgeContainer: {
    marginTop: 6,
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Palette.primary,
  },
  stageBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primaryDark,
  },
});
