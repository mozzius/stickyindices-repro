import { useCallback, useMemo, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Switch, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [items, setItems] = useState(() => createPage(0))

  const [disableBatching, setDisableBatching] = useState(false)

  const stickyHeaderIndices = useMemo(
    () =>
      items.reduce(
        (acc, curr) =>
        curr.sticky
            ? acc.concat(items.indexOf(curr))
            : acc,
        [] as number[],
      ),
    [items],
  )

  const onEndReached = useCallback(() => {
    setItems(prevItems => [...prevItems, ...createPage(prevItems.length / 11 + 1)])
  }, [])

  return (
    <SafeAreaView>
      <View style={styles.control}>
        <Switch
          value={disableBatching}
          onValueChange={setDisableBatching}
        />
        <Text>{`maxToRenderPerBatch={${disableBatching ? 1 : 10 }}`}</Text>
      </View>
      <FlatList
        data={items}
        stickyHeaderIndices={stickyHeaderIndices}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={4}
        /**
         * Default: 10
         */
        initialNumToRender={10}
        /**
         * Default: 21
         */
        windowSize={21}
        /**
         * Default: 10
         *
         * SET THIS TO 1 TO MAKE IT FREAK OUT REALLY EASILY
         */
        maxToRenderPerBatch={disableBatching ? 1 : 10}
        /**
         * Default: 50
         */
        updateCellsBatchingPeriod={50}
      />
    </SafeAreaView>
  );
}

function keyExtractor(item: any) {
  return item.id;
}

function renderItem({ item }: { item: { id: string; title: string; sticky: boolean } }) {
  if (item.sticky) {
    return (
      <View style={styles.stickyHeader}>
        <Text style={styles.stickyTitle}>{item.title}</Text>
      </View>
    );
  }
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <ExpensiveComponent />
    </View>
  );
}

// @ts-ignore idk
const now = performance.now;

function ExpensiveComponent() {
  const startTime = now();

  while (now() - startTime < 20) {
    // Simulate expensive computation
  }

  return <Text>Render: {Math.floor(now() - startTime)}ms</Text>
}

function createPage(i: number) {
    const page = [];
    page.push({id: `${i}-header`, title: `Header ${i}`, sticky: true})
    for (let j = 0; j < 10; j++) {
      page.push({ id: `${i}-${j}`, title: `Item ${i}-${j}`, sticky: false, });
    }
    return page;
}

export default App;

const styles = StyleSheet.create({
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
    gap: 12,
  },
  stickyHeader: {
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  stickyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    height: 200
  },
  title: {
    fontSize: 16,
  },
});
