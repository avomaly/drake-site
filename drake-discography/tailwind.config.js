export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0D0608',
        burgundy: '#4A0E1A',
        wine: '#2D0810',
        champagne: '#F5E6D0',
        'rose-gold': '#C49A6C',
        cream: '#FAF3E8',
        ovo: {
          gold: '#C49A6C',
          dark: '#0D0608',
          mid: '#1A0810',
        }
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        inter: ['Inter', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
      }
    }
  },
  plugins: []
}
