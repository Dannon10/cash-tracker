// import { useState } from 'react'
// import { FlatList, Text, View } from 'react-native'
// import tw from 'twrnc'
// import { useTransactionStore } from '../store/useTransactionStore'
// import { useThemeStore } from '../store/useThemeStore'
// import { Transaction } from '../types/transactions'
// import TransactionItem from './TransactionItem'
// import TransactionItemSkeleton from './TransactionItemSkeleton'
// import EditTransactionModal from './EdittransactionModal'
// import AntDesign from '@expo/vector-icons/AntDesign';

// type Props = {
//     transactions: Transaction[]
// }

// export default function TransactionsList({ transactions }: Props) {
//     const loading = useTransactionStore((state) => state.loading)
//     const { isDark } = useThemeStore()
//     const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

//     const handleDelete = (id: string) => {
//         useTransactionStore.getState().deleteTransaction(id)
//     }

//     const handleEdit = (item: Transaction) => {
//         setEditingTransaction(item)
//     }

//     if (loading) {
//         return (
//             <View style={tw`mt-6`}>
//                 {Array.from({ length: 6 }).map((_, i) => (
//                     <TransactionItemSkeleton key={`skeleton-${i}`} />
//                 ))}
//             </View>
//         )
//     }

//     if (!transactions.length) {
//         return (
//             <View style={tw`items-center`}>
//             <Text style={[tw`text-center mt-10 mb-3`, { color: isDark ? '#4b5563' : '#9ca3af' }]}>
//                 No transactions yet! Add a transaction to get started. 
//             </Text>
// <AntDesign name="arrow-down" size={40} color="black/10" />
//             </View>
//         )
//     }

//     return (
//         <>
//             <FlatList
//                 data={transactions}
//                 keyExtractor={(item) => item.id}
//                 contentContainerStyle={tw`mt-6 px-0`}
//                 showsVerticalScrollIndicator={false}
//                 scrollEnabled={false}
//                 renderItem={({ item }) => (
//                     <TransactionItem
//                         item={item}
//                         onDelete={handleDelete}
//                         onEdit={handleEdit}
//                     />
//                 )}
//             />

//             <EditTransactionModal
//                 visible={!!editingTransaction}
//                 transaction={editingTransaction}
//                 onClose={() => setEditingTransaction(null)}
//             />
//         </>
//     )
// }




import { useState, useRef, useEffect } from 'react'
import { FlatList, Text, View, Animated } from 'react-native'
import tw from 'twrnc'
import { useTransactionStore } from '../store/useTransactionStore'
import { useThemeStore } from '../store/useThemeStore'
import { Transaction } from '../types/transactions'
import TransactionItem from './TransactionItem'
import TransactionItemSkeleton from './TransactionItemSkeleton'
import EditTransactionModal from './EdittransactionModal'
import AntDesign from '@expo/vector-icons/AntDesign'

type Props = {
    transactions: Transaction[]
}

export default function TransactionsList({ transactions }: Props) {
    const loading = useTransactionStore((state) => state.loading)
    const { isDark } = useThemeStore()
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

    // 🔥 Animated value for bouncing arrow
    const bounceAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const bounce = Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 10,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        )

        bounce.start()

        return () => bounce.stop()
    }, [bounceAnim])

    const handleDelete = (id: string) => {
        useTransactionStore.getState().deleteTransaction(id)
    }

    const handleEdit = (item: Transaction) => {
        setEditingTransaction(item)
    }

    if (loading) {
        return (
            <View style={tw`mt-6`}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <TransactionItemSkeleton key={`skeleton-${i}`} />
                ))}
            </View>
        )
    }

    if (!transactions.length) {
        return (
            <View style={tw`items-center`}>
                <Text
                    style={[
                        tw`text-center mt-10 mb-3`,
                        { color: isDark ? '#4b5563' : '#9ca3af' },
                    ]}
                >
                    No transactions yet! Add a transaction to get started.
                </Text>

                {/* 🔥 Bouncing Arrow */}
                <Animated.View
                    style={{
                        transform: [{ translateY: bounceAnim }],
                    }}
                >
                    <AntDesign
                        name="arrow-down"
                        size={40}
                        color={isDark ? '#4b5563' : '#76797d'}
                    />
                </Animated.View>
            </View>
        )
    }

    return (
        <>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={tw`mt-6 px-0`}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <TransactionItem
                        item={item}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                )}
            />

            <EditTransactionModal
                visible={!!editingTransaction}
                transaction={editingTransaction}
                onClose={() => setEditingTransaction(null)}
            />
        </>
    )
}