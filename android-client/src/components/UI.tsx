import React from 'react';
import { Text, View, TouchableNativeFeedback, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Car, RootStackParamList } from '@/types/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';

export const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const theme = useTheme();
    return (
        <View style={{
            flexDirection: 'row',
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderTopColor: theme.colors.onBackground,
        }}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : route.name;

                const isFocused = state.index === index;

                return (
                    <TouchableNativeFeedback
                        key={route.key}
                        onPress={() => navigation.navigate(route.name)}
                    >
                        <View style={{
                            flex: 1,
                            paddingVertical: 15,
                            backgroundColor: isFocused ? theme.colors.primary : theme.colors.surface,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{
                                color: isFocused ? theme.colors.surface : theme.colors.onBackground,
                                fontWeight: 'bold',
                                fontSize: 14,
                            }}>
                                {label}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                );
            })}
        </View>
    );
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'CarDetail'>;

export const ReturnButton = ({ color = 'white' }: { color?: string }) => {
    const navigation = useNavigation<NavigationProp>();
    return (
        <View style={{
            position: 'absolute',
            zIndex: 1,
            top: 10,
            left: 10,
        }}>
            <TouchableOpacity onPress={() => { navigation.goBack() }}>
                <Ionicons name="chevron-back" size={35} color={color} />
            </TouchableOpacity >
        </View>
    )
}

export const DisplayWithLabel = ({ label, displayText, size = 22, displaySize = 16 }: { label: string; displayText: string; size?: number; displaySize?: number }) => {
    const labelLineHeight = size * 1.2;
    const displayLineHeight = displaySize * 1.4;
    const theme = useTheme();

    return (
        <View
            style={{
                flexDirection: 'row',
                marginBottom: 10,
                paddingHorizontal: 15,
                alignItems: 'flex-start', // Align items to the top
                flexWrap: 'wrap',
            }}
        >
            <Text
                style={{
                    fontSize: size,
                    fontWeight: 'bold',
                    color: theme.colors.onSurface,
                    marginRight: 10,
                    lineHeight: labelLineHeight,
                }}
            >
                {label}
            </Text>

            <Text
                style={{
                    fontSize: displaySize,
                    color: theme.colors.onSurfaceVariant,
                    textAlign: 'right',
                    lineHeight: displayLineHeight,
                    flex: 1,
                }}
            >
                {displayText}
            </Text>
        </View>
    );
};


export const InputWithLabel = (props: any) => {

    const orientationDirection = (props.orientation == 'horizontal') ? 'row' : 'column';

    return (
        <View style={{
            flexDirection: orientationDirection,
            marginBottom: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white'
        }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 15 }}>{props.label}</Text>
            <TextInput
                style={{
                    fontSize: 14,
                    color: props.color ? props.color : 'rgba(0,0,0,0.8)',
                    // color: 'rgba(0,0,0,0.8)',
                    backgroundColor: 'white',
                    width: '45%',
                    marginRight: 10,
                    borderWidth: 0.5,
                    borderColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 5,
                    elevation: 2,
                }}
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                {...props}
            />
        </View>
    );
}