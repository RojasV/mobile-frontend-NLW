import { SafeAreaView } from 'react-native-safe-area-context';
import { Background } from '../../components/Background';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons'

import { styles } from './styles';
import { GameParams } from '../../types/navigation';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import { THEME } from '../../theme';
import LogoImg from '../../assets/logo-nlw-esports.png'
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { DuoMatch } from '../../components/DuoMatch';

export function Game() {

    const [duo, setDuos] = useState<DuoCardProps[]>([])
    const [discordDuoSelected, setDiscordDuoSelected] = useState('')

    const route = useRoute()
    const game = route.params as GameParams
    const navigation = useNavigation()

    function handleGoBack() {
        navigation.goBack()
    }

    async function getDiscordUser(adsId: string) {
        fetch(`http://192.168.15.9:3333/ads/${adsId}/discord`)
        .then(response => response.json())
        .then(data => setDiscordDuoSelected(data.discord))
    }

    useEffect(() => {
        fetch(`http://192.168.15.9:3333/games/${game.id}/ads`)
            .then(response => response.json())
            .then(data => setDuos(data))
    }, [])

    return (

        <Background>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Entypo
                            name='chevron-thin-left'
                            color={THEME.COLORS.CAPTION_300}
                        />
                    </TouchableOpacity>

                    <Image
                        source={LogoImg}
                        style={styles.logo}
                    />
                    <View style={styles.right} />
                </View>

                <Image
                    source={{ uri: game.bannerUrl }}
                    style={styles.cover}
                    resizeMode="cover"
                />

                <Heading
                    title={game.title}
                    subtitle='Conecte-se e comece a jogar'
                />

                <FlatList
                    data={duo}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <DuoCard data={item} onConnect={() => getDiscordUser(item.id)} />
                    )}
                    horizontal={true}
                    contentContainerStyle={[styles.contentList, duo.length === 0 && { flex: 1, alignItems: "center" }]}
                    showsHorizontalScrollIndicator={false}
                    style={styles.containerList}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyListText}>
                            Não há anúncios publicados para esse jogo ainda...
                        </Text>
                    )}
                />

                <DuoMatch
                    onClose={() => setDiscordDuoSelected('')}
                    visible={discordDuoSelected.length > 0}
                    discord={discordDuoSelected}
                />
            </SafeAreaView>
        </Background>
    );
}