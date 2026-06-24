import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import {
  MEAL_TYPES,
  MealType,
  caloriesFromMacros,
  cleanDecimalInput,
  toLocalDateKey,
} from '../lib/core';
import {
  NormalizedFoodSearchResult,
  isFoodSearchConfigured,
  searchFoods,
} from '../lib/fatsecret';

export default function FoodLogScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { getFoods, addFood, removeFood, getDailySummary } = useData();

  const today = toLocalDateKey();
  const foods = getFoods(today);
  const summary = getDailySummary(today);
  const target = summary.calorieTarget?.goalCalories ?? null;
  const eaten = Math.round(summary.consumed.total);

  const [meal, setMeal] = useState<MealType>('breakfast');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NormalizedFoodSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchEnabled = isFoodSearchConfigured();

  const [manual, setManual] = useState({ name: '', protein: '', carbs: '', fat: '' });

  useEffect(() => {
    if (!searchEnabled || !query.trim()) {
      setResults([]);
      return;
    }
    let active = true;
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const found = await searchFoods(query);
        if (active) setResults(found);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setSearching(false);
      }
    }, 450);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, searchEnabled]);

  function handleSelectResult(food: NormalizedFoodSearchResult) {
    addFood(today, {
      id: '',
      name: food.name,
      calories: Math.round(food.calories),
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      brand: food.brand || undefined,
      externalId: food.id,
      meal,
    });
    setQuery('');
    setResults([]);
  }

  function handleManualAdd() {
    if (!manual.name.trim()) return;
    const protein = Number.parseFloat(manual.protein) || 0;
    const carbs = Number.parseFloat(manual.carbs) || 0;
    const fat = Number.parseFloat(manual.fat) || 0;
    addFood(today, {
      id: '',
      name: manual.name.trim(),
      calories: Math.round(caloriesFromMacros(protein, carbs, fat)),
      protein,
      carbs,
      fat,
      meal,
    });
    setManual({ name: '', protein: '', carbs: '', fat: '' });
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backChevron, { color: colors.text }]}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Log food</Text>
        <Text style={[styles.headerCalories, { color: colors.textMuted }]}>
          {eaten.toLocaleString()}
          {target != null ? ` / ${target.toLocaleString()}` : ''}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Meal selector */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ADDING TO</Text>
          <View style={styles.mealRow}>
            {MEAL_TYPES.map((m) => {
              const active = meal === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.mealChip,
                    {
                      backgroundColor: active ? colors.teal : colors.card,
                      borderColor: active ? colors.teal : colors.borderLight,
                    },
                  ]}
                  onPress={() => setMeal(m.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.mealChipText, { color: active ? '#fff' : colors.textMuted }]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Search */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>SEARCH FOODS</Text>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
            <Text style={[styles.searchIcon, { color: colors.textMuted }]}>{'🔍'}</Text>
            <TextInput
              placeholder={searchEnabled ? 'Banana, chicken breast, oatmeal' : 'Food search not configured'}
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.text }]}
              value={query}
              onChangeText={setQuery}
              editable={searchEnabled}
              autoCorrect={false}
            />
            {searching && <ActivityIndicator size="small" color={colors.teal} />}
          </View>
          {!searchEnabled && (
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              Add FatSecret API keys to enable food search. You can still log foods
              manually below.
            </Text>
          )}

          {results.length > 0 && (
            <View style={[styles.resultsCard, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
              {results.map((food, index) => (
                <TouchableOpacity
                  key={`${food.id}-${index}`}
                  style={[styles.resultRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
                  onPress={() => handleSelectResult(food)}
                  activeOpacity={0.6}
                >
                  <View style={styles.resultLeft}>
                    <Text style={[styles.resultName, { color: colors.text }]} numberOfLines={1}>
                      {food.name}
                    </Text>
                    {food.brand ? (
                      <Text style={[styles.resultBrand, { color: colors.textMuted }]} numberOfLines={1}>
                        {food.brand}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.resultRight}>
                    <Text style={[styles.resultCal, { color: colors.text }]}>{Math.round(food.calories)} cal</Text>
                    <Text style={[styles.resultMacros, { color: colors.textMuted }]}>
                      P{food.protein.toFixed(0)} C{food.carbs.toFixed(0)} F{food.fat.toFixed(0)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Manual entry */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: 18 }]}>MANUAL ENTRY</Text>
          <View style={[styles.manualCard, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
            <TextInput
              placeholder="Food name"
              placeholderTextColor={colors.textMuted}
              style={[styles.manualName, { color: colors.text, borderColor: colors.borderLight }]}
              value={manual.name}
              onChangeText={(t) => setManual({ ...manual, name: t })}
            />
            <View style={styles.macroInputs}>
              {(['protein', 'carbs', 'fat'] as const).map((key) => (
                <View key={key} style={styles.macroInputWrap}>
                  <TextInput
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                    style={[styles.macroInput, { color: colors.text, borderColor: colors.borderLight }]}
                    value={manual[key]}
                    onChangeText={(t) => setManual({ ...manual, [key]: cleanDecimalInput(t) })}
                    keyboardType="decimal-pad"
                  />
                  <Text style={[styles.macroInputLabel, { color: colors.textMuted }]}>
                    {key === 'protein' ? 'Protein' : key === 'carbs' ? 'Carbs' : 'Fat'} (g)
                  </Text>
                </View>
              ))}
            </View>
            <Text style={[styles.calcLine, { color: colors.textMuted }]}>
              ={' '}
              {Math.round(
                caloriesFromMacros(
                  Number.parseFloat(manual.protein) || 0,
                  Number.parseFloat(manual.carbs) || 0,
                  Number.parseFloat(manual.fat) || 0
                )
              )}{' '}
              kcal
            </Text>
            <TouchableOpacity
              style={[styles.manualButton, { backgroundColor: manual.name.trim() ? colors.teal : colors.border }]}
              onPress={handleManualAdd}
              disabled={!manual.name.trim()}
              activeOpacity={0.85}
            >
              <Text style={styles.manualButtonText}>Add food</Text>
            </TouchableOpacity>
          </View>

          {/* Logged foods grouped by meal */}
          {MEAL_TYPES.map((m) => {
            const items = foods.filter((f) => (f.meal || 'snack') === m.id);
            if (items.length === 0) return null;
            const mealCal = Math.round(items.reduce((sum, f) => sum + (f.calories || 0), 0));
            return (
              <View key={m.id} style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <Text style={[styles.mealLabel, { color: colors.textMuted }]}>
                    {m.label.toUpperCase()}
                  </Text>
                  <Text style={[styles.mealCalories, { color: colors.textMuted }]}>· {mealCal}</Text>
                </View>
                <View style={[styles.itemsCard, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
                  {items.map((item, index) => (
                    <View key={item.id}>
                      {index > 0 && <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />}
                      <View style={styles.itemRow}>
                        <View style={styles.itemLeft}>
                          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={[styles.itemMacros, { color: colors.textMuted }]}>
                            P{item.protein.toFixed(0)} C{item.carbs.toFixed(0)} F{item.fat.toFixed(0)}
                          </Text>
                        </View>
                        <Text style={[styles.itemCal, { color: colors.text }]}>{Math.round(item.calories)}</Text>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeFood(today, item.id)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Text style={[styles.removeText, { color: colors.coral }]}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          {foods.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No foods logged yet today. Search or add one above.
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: { fontSize: 22, marginTop: -2, marginLeft: -1 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 12, flex: 1 },
  headerCalories: { fontSize: 14, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  mealRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  mealChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  mealChipText: { fontSize: 12.5, fontWeight: '700' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500', padding: 0 },
  hint: { fontSize: 12.5, fontWeight: '500', marginTop: 8, lineHeight: 18 },
  resultsCard: {
    borderRadius: 16,
    marginTop: 10,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  resultLeft: { flex: 1, marginRight: 10 },
  resultName: { fontSize: 14.5, fontWeight: '600' },
  resultBrand: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  resultRight: { alignItems: 'flex-end' },
  resultCal: { fontSize: 14, fontWeight: '700' },
  resultMacros: { fontSize: 11.5, fontWeight: '500', marginTop: 1 },
  manualCard: {
    borderRadius: 18,
    padding: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  manualName: {
    fontSize: 15,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 10,
  },
  macroInputs: { flexDirection: 'row', gap: 8 },
  macroInputWrap: { flex: 1 },
  macroInput: {
    fontSize: 15,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    textAlign: 'center',
  },
  macroInputLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center', marginTop: 4 },
  calcLine: { fontSize: 13, fontWeight: '700', textAlign: 'right', marginTop: 10 },
  manualButton: {
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  manualButtonText: { fontSize: 15.5, fontWeight: '700', color: '#fff' },
  mealSection: { marginTop: 22 },
  mealHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  mealLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  mealCalories: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginLeft: 4 },
  itemsCard: {
    borderRadius: 18,
    padding: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  itemLeft: { flex: 1, marginRight: 12 },
  itemName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  itemMacros: { fontSize: 12, fontWeight: '500' },
  itemCal: { fontSize: 15, fontWeight: '700', marginRight: 12 },
  removeButton: { padding: 2 },
  removeText: { fontSize: 14, fontWeight: '700' },
  itemDivider: { height: 1, marginHorizontal: 14 },
  emptyText: { fontSize: 13.5, fontWeight: '500', textAlign: 'center', marginTop: 28 },
});
