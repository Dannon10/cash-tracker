import { View } from 'react-native'
import tw from 'twrnc'
import Skeleton from './Skeleton'

export default function TransactionItemSkeleton() {
    return (
        <View style={tw`rounded-xl p-4 mb-3 flex-row items-center gap-3`}>
            <Skeleton width={44} height={44} borderRadius={999} />
            <View style={tw`flex-1`}>
                <View style={tw`flex-row justify-between items-center mb-1`}>
                    <Skeleton width={'50%'} height={16} />
                    <Skeleton width={80} height={16} />
                </View>
                <View style={tw`flex-row justify-between items-center`}>
                    <Skeleton width={120} height={12} />
                    <Skeleton width={60} height={12} />
                </View>
            </View>
        </View>
    )
}
