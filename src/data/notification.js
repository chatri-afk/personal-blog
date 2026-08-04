const AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'

export const MOCK_NOTIFICATIONS = [
    {
      id: 1,
      type: 'comment',
      userName: 'Jacob Lash',
      avatar: AVATAR,
      articleTitle: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
      articleId: 2,
      comment:
        'I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.',
      timeAgo: '4 hours ago',
    },
    {
      id: 2,
      type: 'like',
      userName: 'Jacob Lash',
      avatar: AVATAR,
      articleTitle: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
      articleId: 2,
      timeAgo: '4 hours ago',
    },
  ]