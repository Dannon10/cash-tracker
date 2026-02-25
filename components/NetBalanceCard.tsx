import { View} from 'react-native'
import { Text } from '@/components/AppText'
import tw from 'twrnc'
import FontAwesome from '@expo/vector-icons/FontAwesome'

interface Props {
    netBalance: number
}

export default function NetBalanceCard({ netBalance }: Props) {
    return (
        <View
            style={tw`mx-5 mt-3 rounded-2xl p-4 ${netBalance >= 0 ? 'bg-indigo-500' : 'bg-orange-500'
                }`}
        >
            <Text style={tw`text-indigo-100 text-xs mb-1`}>
                Net Balance
            </Text>

            <View style={tw`flex-row items-center justify-between`}>
                <Text weight='bold' style={tw`text-white text-2xl`}>
                    {netBalance >= 0 ? '+' : '-'}₦
                    {Math.abs(netBalance).toLocaleString()}
                </Text>

                {netBalance >= 0 ? (
                    <FontAwesome name="line-chart" size={24} color="white" />
                ) : (
                    <Text style={tw`text-2xl`}>📉</Text>
                )}
            </View>
        </View>
    )
}