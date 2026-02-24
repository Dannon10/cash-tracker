import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import tailwind from "twrnc";
import { ZodError } from "zod";
import { loginSchema, registerSchema } from "../../schemas/authSchemas";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import { LoginUser, RegisterUser } from "../../types/user";

const AuthScreen = () => {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isRegistering, setIsRegistering] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { signIn, signUp } = useAuthStore()
    const { isDark } = useThemeStore()
    const router = useRouter()

    const bg = isDark ? '#0f0f0f' : '#ffffff'
    const textPrimary = isDark ? '#ffffff' : '#0B0B0B'
    const inputBg = isDark ? '#1a1a1a' : '#ffffff'
    const inputBorder = isDark ? '#2a2a2a' : '#d1d5db'
    const placeholderColor = isDark ? '#4b5563' : '#aaaaaa'

    const clearErrors = () => setErrors({})

    const handleSubmit = async () => {
        clearErrors()
        setLoading(true)
        try {
            if (isRegistering) {
                const registerData: RegisterUser = { name, email, password }
                registerSchema.parse({ ...registerData, confirmPassword })
                const error = await signUp(registerData.email, registerData.password, registerData.name)
                if (error) { setErrors({ general: error }); return }
                router.replace('/(tabs)/transactions')
            } else {
                const loginData: LoginUser = { email, password }
                loginSchema.parse(loginData)
                const error = await signIn(loginData.email, loginData.password)
                if (error) { setErrors({ general: error }); return }
                router.replace('/(tabs)/transactions')
            }
        } catch (err) {
            if (err instanceof ZodError) {
                const fieldErrors: Record<string, string> = {}
                err.issues.forEach((e) => {
                    const field = e.path[0] as string
                    fieldErrors[field] = e.message
                })
                setErrors(fieldErrors)
            }
        } finally {
            setLoading(false)
        }
    }

    const switchMode = () => {
        setIsRegistering(!isRegistering)
        clearErrors()
        setEmail(''); setPassword(''); setConfirmPassword('')
    }

    const inputStyle = (hasError: boolean): any => ({
        paddingVertical: 16,
        paddingLeft: 24,
        paddingRight: 52, // room for the eye icon
        borderRadius: 8,
        borderWidth: 1,
        borderColor: hasError ? '#f87171' : inputBorder,
        backgroundColor: inputBg,
        color: textPrimary,
        fontSize: 16,
        width: '100%',
    })

    // Wraps input + absolutely positioned eye icon
    const PasswordInput = ({
        value,
        onChange,
        placeholder,
        show,
        toggleShow,
        hasError,
    }: {
        value: string
        onChange: (v: string) => void
        placeholder: string
        show: boolean
        toggleShow: () => void
        hasError: boolean
    }) => (
        <View style={{ position: 'relative' }}>
            <TextInput
                style={inputStyle(hasError)}
                placeholder={placeholder}
                value={value}
                placeholderTextColor={placeholderColor}
                onChangeText={(v) => { onChange(v); clearErrors() }}
                secureTextEntry={!show}
                textContentType="none"
                autoCorrect={false}
            />
            <TouchableOpacity
                onPress={toggleShow}
                style={{
                    position: 'absolute',
                    right: 16,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <MaterialCommunityIcons
                    name={show ? 'eye-off' : 'eye'}
                    size={22}
                    color={placeholderColor}
                />
            </TouchableOpacity>
        </View>
    )

    return (
        <KeyboardAvoidingView
            style={[tailwind`flex-1`, { backgroundColor: bg }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={tailwind`flex-grow items-center justify-center p-4`}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={[tailwind`text-4xl font-bold mb-6`, { color: textPrimary }]}>
                    {isRegistering ? 'Sign Up' : 'Login'}
                </Text>

                {errors.general ? (
                    <Text style={tailwind`text-red-500 mb-4 text-sm text-center w-[80%]`}>
                        {errors.general}
                    </Text>
                ) : null}

                {/* Name (register only) */}
                {isRegistering && (
                    <View style={tailwind`w-[80%] mb-4`}>
                        <TextInput
                            style={inputStyle(!!errors.name)}
                            placeholder="Full Name"
                            value={name}
                            placeholderTextColor={placeholderColor}
                            onChangeText={(v) => { setName(v); clearErrors() }}
                            autoCapitalize="words"
                        />
                        {errors.name ? (
                            <Text style={tailwind`text-red-500 text-xs mt-1 ml-1`}>{errors.name}</Text>
                        ) : null}
                    </View>
                )}

                {/* Email */}
                <View style={tailwind`w-[80%] mb-4`}>
                    <TextInput
                        style={inputStyle(!!errors.email)}
                        placeholder="Email"
                        value={email}
                        placeholderTextColor={placeholderColor}
                        onChangeText={(v) => { setEmail(v); clearErrors() }}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    {errors.email ? (
                        <Text style={tailwind`text-red-500 text-xs mt-1 ml-1`}>{errors.email}</Text>
                    ) : null}
                </View>

                {/* Password */}
                <View style={tailwind`w-[80%] mb-4`}>
                    <PasswordInput
                        value={password}
                        onChange={setPassword}
                        placeholder="Password"
                        show={showPassword}
                        toggleShow={() => setShowPassword(s => !s)}
                        hasError={!!errors.password}
                    />
                    {errors.password ? (
                        <Text style={tailwind`text-red-500 text-xs mt-1 ml-1`}>{errors.password}</Text>
                    ) : null}
                </View>

                {/* Confirm Password (register only) */}
                {isRegistering && (
                    <View style={tailwind`w-[80%] mb-4`}>
                        <PasswordInput
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder="Confirm Password"
                            show={showConfirmPassword}
                            toggleShow={() => setShowConfirmPassword(s => !s)}
                            hasError={!!errors.confirmPassword}
                        />
                        {errors.confirmPassword ? (
                            <Text style={tailwind`text-red-500 text-xs mt-1 ml-1`}>{errors.confirmPassword}</Text>
                        ) : null}
                    </View>
                )}

                {/* Submit */}
                <TouchableOpacity
                    style={[
                        tailwind`mt-6 py-4 w-[80%] px-6 rounded-lg mb-6`,
                        { backgroundColor: '#0B0B0B', opacity: loading ? 0.6 : 1 }
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={tailwind`text-white text-base font-bold text-center`}>
                        {loading
                            ? (isRegistering ? 'Creating account...' : 'Logging in...')
                            : isRegistering ? 'Sign Up' : 'Login'}
                    </Text>
                </TouchableOpacity>

                {/* Switch mode */}
                <TouchableOpacity onPress={switchMode}>
                    <Text style={[tailwind`mt-3 text-base`, { color: '#007bff' }]}>
                        {isRegistering
                            ? "Already have an account? Login"
                            : "Don't have an account? Sign Up"}
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AuthScreen;