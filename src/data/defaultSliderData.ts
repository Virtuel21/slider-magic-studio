import { SliderData } from '@/types/slider';

export const defaultSliderData: SliderData = {
  slides: [
    {
      id: '1',
      title: ['IL Y A TOUJOURS', 'UNE BONNE RAISON', 'DE FAIRE PLAISIR'],
      subtitle: ['Célébrer les étapes', 'importantes de la vie,', 'les anniversaires, les réussites...'],
      imageUrl: 'https://upload.snrcdn.net/089654187a7f3816659495cc1fcb80a7356a4069/default/origin/aac011858e4f46159c6227404a36f2bb.png',
      buttons: [
        { id: '1-1', text: 'SUIVANT', url: '#next', variant: 'primary' }
      ]
    },
    {
      id: '2',
      title: ['ENVOYER VOS COLIS', 'en locker dès 3,99€'],
      subtitle: ['On vous réserve un', 'avantage exclusif !'],
      imageUrl: 'https://upload.snrcdn.net/089654187a7f3816659495cc1fcb80a7356a4069/default/origin/1e5d70837b81433d8434f1a10dcf1d83.png',
      buttons: [
        { id: '2-1', text: 'JE FONCE', url: '#next', variant: 'primary' }
      ]
    },
    {
      id: '3',
      title: ['Profitez de', '-20%'],
      subtitle: ['Sur votre premier envoi', 'avec le code :', 'NEW-2456'],
      imageUrl: 'https://upload.snrcdn.net/089654187a7f3816659495cc1fcb80a7356a4069/default/origin/c327efd71a3644f7a125d011b6a25064.png',
      buttons: [
        { id: '3-1', text: 'PLUS TARD', url: '#close', variant: 'outline' },
        { id: '3-2', text: "J'envoie 📦", url: '#action', variant: 'primary' }
      ]
    }
  ],
  config: {
    backgroundColor: '#00C3BE',
    buttonColor: '#FFCC05',
    buttonTextColor: '#391465',
    titleColor: '#391465',
    subtitleColor: '#A3004A',
    accentColor: '#A3004A',
    dotColor: '#391465',
    dotActiveColor: '#FFFFFF',
    arrowColor: '#FFCC05'
  }
};
