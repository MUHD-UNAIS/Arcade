// ============================================================
//  gameData.js — Structured Emotion Data (v5)
//
//  Organized: Grouped into subfolders by emotion.
// ============================================================

/** 
 * Avatar assets
 */
export const AVATARS = [
    '/assets/avatars/avatar_1.svg',
    '/assets/avatars/avatar_2.svg',
    '/assets/avatars/avatar_3.svg',
    '/assets/avatars/avatar_4.svg',
    '/assets/avatars/avatar_5.svg',
    '/assets/avatars/avatar_6.svg',
    '/assets/avatars/avatar_7.svg',
    '/assets/avatars/avatar_8.svg',
    '/assets/avatars/avatar_9.svg',
    '/assets/avatars/avatar_10.svg',
    '/assets/avatars/avatar_11.svg',
    '/assets/avatars/avatar_12.svg',
];

export const ANIMO_MAP = {
    'avatar_1.svg': 'lion', 'avatar_2.svg': 'elephant', 'avatar_3.svg': 'penguin',
    'avatar_4.svg': 'panda', 'avatar_5.svg': 'cat', 'avatar_6.svg': 'dog',
    'avatar_7.svg': 'monkey', 'avatar_8.svg': 'rabbit', 'avatar_9.svg': 'frog',
    'avatar_10.svg': 'owl', 'avatar_11.svg': 'bee', 'avatar_12.svg': 'butterfly'
};

/** 
 * Level configuration 
 */
export const LEVELS = {
    1: { pairs: 3, chances: 3, time: 99999, label: 'Beginner', peekDuration: 3000, peekUses: 3 },
    2: { pairs: 4, chances: 8, time: 99999, label: 'Intermediate', peekDuration: 2000, peekUses: 2 },
    3: { pairs: 6, chances: 13, time: 99999, label: 'Full Journey', peekDuration: 1000, peekUses: 1 },
};

/**
 * Emotion Definitions and their specific card pools.
 */
export const EMOTIONS_DATA = {
    anger: {
        id: 'anger',
        name: 'Anger',
        color: '#FF5252',
        icon: '/assets/emotion/anger/select.svg',
        description: 'Anger helps us fight against problems. It is okay to feel angry, but do not hurt yourself or others.',
        pairs: [
            {
                emotion: { id: 'a1-e', name: 'Mean Behavior', desc: 'Someone is mean or disrespectful.', img: '/assets/emotion/anger/trigger_1.svg' },
                action: { id: 'a1-a', name: 'Walk Away', desc: 'Walk away and cool down.', img: '/assets/emotion/anger/action_1.svg' }
            },
            {
                emotion: { id: 'a2-e', name: 'Unfair Blame', desc: 'Blamed for something I didnt do.', img: '/assets/emotion/anger/trigger_2.svg' },
                action: { id: 'a2-a', name: 'Steady Breaths', desc: 'Take breaths and exhale slowly.', img: '/assets/emotion/anger/action_3.svg' }
            },
            {
                emotion: { id: 'a3-e', name: 'Not Listened To', desc: 'People dont listen or understand me.', img: '/assets/emotion/anger/trigger_3.svg' },
                action: { id: 'a3-a', name: 'Use I-Messages', desc: 'Say what I need and how I feel.', img: '/assets/emotion/anger/action_7.svg' }
            },
            {
                emotion: { id: 'a4-e', name: 'Personal Space', desc: 'Someone gets in my personal space.', img: '/assets/emotion/anger/trigger_4.svg' },
                action: { id: 'a4-a', name: 'Move & Exercise', desc: 'Stretch, do yoga or play a sport.', img: '/assets/emotion/anger/action_4.svg' }
            },
            {
                emotion: { id: 'a5-e', name: 'Losing Game', desc: 'I lose at a game or activity.', img: '/assets/emotion/anger/trigger_5.svg' },
                action: { id: 'a5-a', name: 'Count to 20', desc: 'Count slowly until I feel calmer.', img: '/assets/emotion/anger/action_5.svg' }
            },
            {
                emotion: { id: 'a6-e', name: 'Waiting Turn', desc: 'I have to wait my turn.', img: '/assets/emotion/anger/trigger_6.svg' },
                action: { id: 'a6-a', name: 'Take a Break', desc: 'Use a calming tool like stress ball.', img: '/assets/emotion/anger/action_8.svg' }
            },
            {
                emotion: { id: 'a7-e', name: 'People Yelling', desc: 'People yell at or around me.', img: '/assets/emotion/anger/trigger_7.svg' },
                action: { id: 'a7-a', name: 'Push Wall', desc: 'Push against wall then relax.', img: '/assets/emotion/anger/action_2.svg' }
            },
            {
                emotion: { id: 'a8-e', name: 'Broken Promise', desc: 'Someone lies or breaks a promise.', img: '/assets/emotion/anger/trigger_8.svg' },
                action: { id: 'a8-a', name: 'Scribble', desc: 'Scribble on paper then rip it up.', img: '/assets/emotion/anger/action_6.svg' }
            }
        ]
    },
    sadness: {
        id: 'sadness',
        name: 'Sadness',
        color: '#42A5F5',
        icon: '/assets/emotion/sadness/select.svg',
        description: 'Sadness connects us with those we love. Acknowledge your feelings — it is okay to be sad.',
        pairs: [
            {
                emotion: { id: 's1-e', name: 'Family Arguing', desc: 'When family members are arguing.', img: '/assets/emotion/sadness/trigger_1.svg' },
                action: { id: 's1-a', name: 'Read a Book', desc: 'Escape into a wonderful story.', img: '/assets/emotion/sadness/action_1.svg' }
            },
            {
                emotion: { id: 's2-e', name: 'Left Out', desc: 'Being left out of doing something.', img: '/assets/emotion/sadness/trigger_2.svg' },
                action: { id: 's2-a', name: 'Call a Friend', desc: 'Talk to someone who cares.', img: '/assets/emotion/sadness/action_2.svg' }
            },
            {
                emotion: { id: 's3-e', name: 'People Ignore Me', desc: 'When people ignore me or dont listen.', img: '/assets/emotion/sadness/trigger_3.svg' },
                action: { id: 's3-a', name: 'Create Something', desc: 'Paint, draw, or build something new.', img: '/assets/emotion/sadness/action_3.svg' }
            },
            {
                emotion: { id: 's4-e', name: 'Away From Parents', desc: 'Being away from my parents.', img: '/assets/emotion/sadness/trigger_4.svg' },
                action: { id: 's4-a', name: 'Take a Nap', desc: 'Rest and feel refreshed.', img: '/assets/emotion/sadness/action_4.svg' }
            },
            {
                emotion: { id: 's5-e', name: 'Bad Grade', desc: 'I get a bad grade in school.', img: '/assets/emotion/sadness/trigger_5.svg' },
                action: { id: 's5-a', name: 'Listen Happy Music', desc: 'Play songs that make you smile.', img: '/assets/emotion/sadness/action_5.svg' }
            },
            {
                emotion: { id: 's6-e', name: 'Lose Something', desc: 'Losing something I care about.', img: '/assets/emotion/sadness/trigger_6.svg' },
                action: { id: 's6-a', name: 'Write Feelings', desc: 'Write down how you feel.', img: '/assets/emotion/sadness/action_6.svg' }
            },
            {
                emotion: { id: 's7-e', name: 'Treated Unfairly', desc: 'I get treated unfairly by adults.', img: '/assets/emotion/sadness/trigger_7.svg' },
                action: { id: 's7-a', name: 'Hot Tea', desc: 'Drink something warm and cozy.', img: '/assets/emotion/sadness/action_7.svg' }
            },
            {
                emotion: { id: 's8-e', name: 'Broken Promise', desc: 'Someone breaks a promise to me.', img: '/assets/emotion/sadness/trigger_8.svg' },
                action: { id: 's8-a', name: 'Funny Film', desc: 'Watch a movie that makes you laugh.', img: '/assets/emotion/sadness/action_8.svg' }
            }
        ]
    },
    joy: {
        id: 'joy',
        name: 'Joy',
        color: '#FFD54F',
        icon: '/assets/emotion/joy/select.svg',
        description: 'Joy is a wonderful feeling of happiness and sunshine. Share your joy with others!',
        pairs: [
            {
                emotion: { id: 'j1-e', name: 'Winning', desc: 'Winning a game or activity.', img: '/assets/emotion/joy/trigger_1.svg' },
                action: { id: 'j1-a', name: 'Jump for Joy', desc: 'Move your body with happiness!', img: '/assets/emotion/joy/action_1.svg' }
            },
            {
                emotion: { id: 'j2-e', name: 'Sharing', desc: 'Sharing toys or snacks with friends.', img: '/assets/emotion/joy/trigger_2.svg' },
                action: { id: 'j2-a', name: 'Say Thanks', desc: 'Use kind words to show gratitude.', img: '/assets/emotion/joy/action_2.svg' }
            },
            {
                emotion: { id: 'j3-e', name: 'Kind Word', desc: 'When someone says something nice.', img: '/assets/emotion/joy/trigger_3.svg' },
                action: { id: 'j3-a', name: 'High Five', desc: 'Give a friendly slap of hands!', img: '/assets/emotion/joy/action_3.svg' }
            },
            {
                emotion: { id: 'j4-e', name: 'Finished Task', desc: 'Finishing homework or chores.', img: '/assets/emotion/joy/trigger_4.svg' },
                action: { id: 'j4-a', name: 'Smile at Mirror', desc: 'See your own happy face.', img: '/assets/emotion/joy/action_4.svg' }
            },
            {
                emotion: { id: 'j5-e', name: 'Sunshine', desc: 'A bright and beautiful sunny day.', img: '/assets/emotion/joy/trigger_5.svg' },
                action: { id: 'j5-a', name: 'Draw Happy', desc: 'Draw a picture of your joy.', img: '/assets/emotion/joy/action_5.svg' }
            },
            {
                emotion: { id: 'j6-e', name: 'Outside Play', desc: 'Going outside to play.', img: '/assets/emotion/joy/trigger_6.svg' },
                action: { id: 'j6-a', name: 'Hum a Tune', desc: 'Make some happy music.', img: '/assets/emotion/joy/action_6.svg' }
            },
            {
                emotion: { id: 'j7-e', name: 'New Toy', desc: 'Getting a new toy or book.', img: '/assets/emotion/joy/trigger_7.svg' },
                action: { id: 'j7-a', name: 'Give a Hug', desc: 'Share your warmth with someone.', img: '/assets/emotion/joy/action_7.svg' }
            },
            {
                emotion: { id: 'j8-e', name: 'Laughter', desc: 'Hearing a funny joke.', img: '/assets/emotion/joy/trigger_8.svg' },
                action: { id: 'j8-a', name: 'Clap Hands', desc: 'Show your excitement!', img: '/assets/emotion/joy/action_8.svg' }
            }
        ]
    },
    fear: {
        id: 'fear',
        name: 'Fear',
        color: '#9C27B0',
        icon: '/assets/emotion/fear/select.svg',
        description: 'Fear helps us stay safe from danger. It is okay to feel scared sometimes.',
        pairs: [
            {
                emotion: { id: 'f1-e', name: 'Darkness', desc: 'Being in a very dark room.', img: '/assets/emotion/fear/trigger_1.svg' },
                action: { id: 'f1-a', name: 'Belly Breaths', desc: 'Take deep breaths to feel calm.', img: '/assets/emotion/fear/action_1.svg' }
            },
            {
                emotion: { id: 'f2-e', name: 'Loud Noise', desc: 'A sudden very loud sound.', img: '/assets/emotion/fear/trigger_2.svg' },
                action: { id: 'f2-a', name: 'Soft Toy', desc: 'Stray close to something soft.', img: '/assets/emotion/fear/action_2.svg' }
            },
            {
                emotion: { id: 'f3-e', name: 'Being Lost', desc: 'Not knowing where you are.', img: '/assets/emotion/fear/trigger_3.svg' },
                action: { id: 'f3-a', name: 'Light On', desc: 'Find a light to feel safe.', img: '/assets/emotion/fear/action_3.svg' }
            },
            {
                emotion: { id: 'f4-e', name: 'New Places', desc: 'Going somewhere for the first time.', img: '/assets/emotion/fear/trigger_4.svg' },
                action: { id: 'f4-a', name: 'Stay Near Adult', desc: 'Hold onto a grown-up you trust.', img: '/assets/emotion/fear/action_4.svg' }
            },
            {
                emotion: { id: 'f5-e', name: 'Spiders', desc: 'Seeing a creepy crawly bug.', img: '/assets/emotion/fear/trigger_5.svg' },
                action: { id: 'f5-a', name: 'Happy Place', desc: 'Imagine somewhere you love.', img: '/assets/emotion/fear/action_5.svg' }
            },
            {
                emotion: { id: 'f6-e', name: 'Bad Dream', desc: 'Having a scary dream at night.', img: '/assets/emotion/fear/trigger_6.svg' },
                action: { id: 'f6-a', name: 'Tell Fear GO', desc: 'Tell your fear to go away!', img: '/assets/emotion/fear/action_7.svg' }
            },
            {
                emotion: { id: 'f7-e', name: 'Thunder', desc: 'The loud boom of a storm.', img: '/assets/emotion/fear/trigger_7.svg' },
                action: { id: 'f7-a', name: 'Ask for Hug', desc: 'A hug makes it less scary.', img: '/assets/emotion/fear/action_4.svg' }
            },
            {
                emotion: { id: 'f8-e', name: 'Shadows', desc: 'Seeing a spooky shadow.', img: '/assets/emotion/fear/trigger_8.svg' },
                action: { id: 'f8-a', name: 'Calm Music', desc: 'Listen to quiet, happy songs.', img: '/assets/emotion/fear/action_8.svg' }
            }
        ]
    },
    trust: {
        id: 'trust',
        name: 'Trust',
        color: '#66BB6A',
        icon: '/assets/emotion/trust/select.svg',
        description: 'Trust is feeling safe with people who care about us. It builds strong friendships.',
        pairs: [
            {
                emotion: { id: 't1-e', name: 'Secret', desc: 'Someone keeps your secret safe.', img: '/assets/emotion/trust/trigger_1.svg' },
                action: { id: 't1-a', name: 'Listening', desc: 'Listen carefully to others.', img: '/assets/emotion/trust/action_1.svg' }
            },
            {
                emotion: { id: 't2-e', name: 'Helpful Friend', desc: 'A friend who helps you out.', img: '/assets/emotion/trust/trigger_2.svg' },
                action: { id: 't2-a', name: 'Body Language', desc: 'Show you are open and friendly.', img: '/assets/emotion/trust/action_2.svg' }
            },
            {
                emotion: { id: 't3-e', name: 'Listened To', desc: 'When you are truly heard.', img: '/assets/emotion/trust/trigger_3.svg' },
                action: { id: 't3-a', name: 'Eye Contact', desc: 'Look at the person you talk to.', img: '/assets/emotion/trust/action_3.svg' }
            },
            {
                emotion: { id: 't4-e', name: 'Greeting', desc: 'A warm and kind hello.', img: '/assets/emotion/trust/trigger_4.svg' },
                action: { id: 't4-a', name: 'Share Story', desc: 'Tell a friend about your day.', img: '/assets/emotion/trust/action_4.svg' }
            },
            {
                emotion: { id: 't5-e', name: 'Shared Snack', desc: 'Sharing delicious food.', img: '/assets/emotion/trust/trigger_5.svg' },
                action: { id: 't5-a', name: 'Offer Help', desc: 'Help someone who needs it.', img: '/assets/emotion/trust/action_5.svg' }
            },
            {
                emotion: { id: 't6-e', name: 'Safe Place', desc: 'Somewhere you feel protected.', img: '/assets/emotion/trust/trigger_6.svg' },
                action: { id: 't6-a', name: 'Gentle Five', desc: 'A light and happy high five.', img: '/assets/emotion/trust/action_6.svg' }
            },
            {
                emotion: { id: 't7-e', name: 'Family Time', desc: 'Spending time with loved ones.', img: '/assets/emotion/trust/trigger_7.svg' },
                action: { id: 't7-a', name: 'Handshake', desc: 'A firm and friendly greeting.', img: '/assets/emotion/trust/action_7.svg' }
            },
            {
                emotion: { id: 't8-e', name: 'Gentle Words', desc: 'Someone speaking softly.', img: '/assets/emotion/trust/trigger_8.svg' },
                action: { id: 't8-a', name: 'Heart Hug', desc: 'Give a hug from the heart.', img: '/assets/emotion/trust/action_8.svg' }
            }
        ]
    },
    disgust: {
        id: 'disgust',
        name: 'Disgust',
        color: '#AFB42B',
        icon: '/assets/emotion/disgust/select.svg',
        description: 'Disgust helps us avoid things that might be unhealthy or yucky. Listen to your nose!',
        pairs: [
            {
                emotion: { id: 'd1-e', name: 'Bad Smell', desc: 'Something that smells gross.', img: '/assets/emotion/disgust/trigger_1.svg' },
                action: { id: 'd1-a', name: 'Wash Hands', desc: 'Clean up to feel fresh.', img: '/assets/emotion/disgust/action_1.svg' }
            },
            {
                emotion: { id: 'd2-e', name: 'Yucky Taste', desc: 'Something that tastes bad.', img: '/assets/emotion/disgust/trigger_2.svg' },
                action: { id: 'd2-a', name: 'Tidy Space', desc: 'Clear out the mess.', img: '/assets/emotion/disgust/action_2.svg' }
            },
            {
                emotion: { id: 'd3-e', name: 'Dirty Room', desc: 'Too many things on floor.', img: '/assets/emotion/disgust/trigger_3.svg' },
                action: { id: 'd3-a', name: 'Step Away', desc: 'Move to a cleaner spot.', img: '/assets/emotion/disgust/action_3.svg' }
            },
            {
                emotion: { id: 'd4-e', name: 'Slimy', desc: 'A sticky or gooey texture.', img: '/assets/emotion/disgust/trigger_4.svg' },
                action: { id: 'd4-a', name: 'Fresh Water', desc: 'Rinse off with cool water.', img: '/assets/emotion/disgust/action_4.svg' }
            },
            {
                emotion: { id: 'd5-e', name: 'Trash', desc: 'Seeing a lot of garbage.', img: '/assets/emotion/disgust/trigger_5.svg' },
                action: { id: 'd5-a', name: 'Wipe Off', desc: 'Use a cloth to clean up.', img: '/assets/emotion/disgust/action_5.svg' }
            },
            {
                emotion: { id: 'd6-e', name: 'Spoiled Food', desc: 'Food that has gone bad.', img: '/assets/emotion/disgust/trigger_6.svg' },
                action: { id: 'd6-a', name: 'Use Tissue', desc: 'Use a paper to pick it up.', img: '/assets/emotion/disgust/action_6.svg' }
            },
            {
                emotion: { id: 'd7-e', name: 'Sticky Fingers', desc: 'Hand feeling icky.', img: '/assets/emotion/disgust/trigger_7.svg' },
                action: { id: 'd7-a', name: 'Open Window', desc: 'Let some fresh air in.', img: '/assets/emotion/disgust/action_7.svg' }
            },
            {
                emotion: { id: 'd8-e', name: 'Muddy Shoes', desc: 'Tracked mud on the carpet.', img: '/assets/emotion/disgust/trigger_8.svg' },
                action: { id: 'd8-a', name: 'Nice Scent', desc: 'Focus on something sweet.', img: '/assets/emotion/disgust/action_8.svg' }
            }
        ]
    },
    anticipation: {
        id: 'anticipation',
        name: 'Anticipation',
        color: '#FB8C00',
        icon: '/assets/emotion/anticipation/select.svg',
        description: 'Anticipation is the excited waiting for something to happen. It is like a countdown for fun!',
        pairs: [
            {
                emotion: { id: 'an1-e', name: 'Birthday', desc: 'Waiting for your big day.', img: '/assets/emotion/anticipation/trigger_1.svg' },
                action: { id: 'an1-a', name: 'Set Timer', desc: 'Watch the time count down.', img: '/assets/emotion/anticipation/action_1.svg' }
            },
            {
                emotion: { id: 'an2-e', name: 'Trip Countdown', desc: 'Almost time for the trip!', img: '/assets/emotion/anticipation/trigger_2.svg' },
                action: { id: 'an2-a', name: 'Make List', desc: 'Write what you will need.', img: '/assets/emotion/anticipation/action_2.svg' }
            },
            {
                emotion: { id: 'an3-e', name: 'Mystery Box', desc: 'A surprise you cant see yet.', img: '/assets/emotion/anticipation/trigger_3.svg' },
                action: { id: 'an3-a', name: 'Visualize', desc: 'Imagine the fun coming up.', img: '/assets/emotion/anticipation/action_3.svg' }
            },
            {
                emotion: { id: 'an4-e', name: 'First Day', desc: 'Starting school very soon.', img: '/assets/emotion/anticipation/trigger_4.svg' },
                action: { id: 'an4-a', name: 'Prepare Stuff', desc: 'Get your bag ready now.', img: '/assets/emotion/anticipation/action_4.svg' }
            },
            {
                emotion: { id: 'an5-e', name: 'Waiting Turn', desc: 'Wanting to go next.', img: '/assets/emotion/anticipation/trigger_5.svg' },
                action: { id: 'an5-a', name: 'Sing Song', desc: 'Sing while you are waiting.', img: '/assets/emotion/anticipation/action_5.svg' }
            },
            {
                emotion: { id: 'an6-e', name: 'New Movie', desc: 'Coming to theaters today!', img: '/assets/emotion/anticipation/trigger_6.svg' },
                action: { id: 'an6-a', name: 'Stay Occupied', desc: 'Play while you wait.', img: '/assets/emotion/anticipation/action_6.svg' }
            },
            {
                emotion: { id: 'an7-e', name: 'Planting', desc: 'Waiting for a seed to grow.', img: '/assets/emotion/anticipation/trigger_7.svg' },
                action: { id: 'an7-a', name: 'Talk About It', desc: 'Share your excitement.', img: '/assets/emotion/anticipation/action_7.svg' }
            },
            {
                emotion: { id: 'an8-e', name: 'Morning Before', desc: 'The excitement of morning.', img: '/assets/emotion/anticipation/trigger_8.svg' },
                action: { id: 'an8-a', name: 'Calm Count', desc: 'Count slowly to keep calm.', img: '/assets/emotion/anticipation/action_8.svg' }
            }
        ]
    },
    surprise: {
        id: 'surprise',
        name: 'Surprise',
        color: '#F06292',
        icon: '/assets/emotion/surprise/select.svg',
        description: 'Surprise happens when something unexpected occurs. It can be a happy or a sudden startle!',
        pairs: [
            {
                emotion: { id: 'su1-e', name: 'Party', desc: 'A surprise party for you!', img: '/assets/emotion/surprise/trigger_1.svg' },
                action: { id: 'su1-a', name: 'Big Breath', desc: 'Calm your excited heart.', img: '/assets/emotion/surprise/action_1.svg' }
            },
            {
                emotion: { id: 'su2-e', name: 'Unexpected Gift', desc: 'Getting a gift suddenly.', img: '/assets/emotion/surprise/trigger_2.svg' },
                action: { id: 'su2-a', name: 'Laughter', desc: 'Let out a happy giggle.', img: '/assets/emotion/surprise/action_2.svg' }
            },
            {
                emotion: { id: 'su3-e', name: 'Sudden Rain', desc: 'When it rains out of nowhere.', img: '/assets/emotion/surprise/trigger_3.svg' },
                action: { id: 'su3-a', name: 'Wide Smile', desc: 'Show your big wide smile!', img: '/assets/emotion/surprise/action_3.svg' }
            },
            {
                emotion: { id: 'su4-e', name: 'Found Item', desc: 'Finding a lost toy.', img: '/assets/emotion/surprise/trigger_4.svg' },
                action: { id: 'su4-a', name: 'Wiggle Fingers', desc: 'Move your hands with joy.', img: '/assets/emotion/surprise/action_4.svg' }
            },
            {
                emotion: { id: 'su5-e', name: 'Balloon Pop', desc: 'Pop! A sudden loud sound.', img: '/assets/emotion/surprise/trigger_5.svg' },
                action: { id: 'su5-a', name: 'Say WOW!', desc: 'Use your words for surprise.', img: '/assets/emotion/surprise/action_5.svg' }
            },
            {
                emotion: { id: 'su6-e', name: 'New Pet', desc: 'Gifting a fuzzy new friend.', img: '/assets/emotion/surprise/trigger_6.svg' },
                action: { id: 'su6-a', name: 'Shake Hands', desc: 'Greet the unexpected.', img: '/assets/emotion/surprise/action_6.svg' }
            },
            {
                emotion: { id: 'su7-e', name: 'Sudden BOO!', desc: 'When someone scares you.', img: '/assets/emotion/surprise/trigger_7.svg' },
                action: { id: 'su7-a', name: 'Happy Dance', desc: 'Move to shake off the shock.', img: '/assets/emotion/surprise/action_7.svg' }
            },
            {
                emotion: { id: 'su8-e', name: 'Funny Face', desc: 'Seeing a hilarious expression.', img: '/assets/emotion/surprise/trigger_8.svg' },
                action: { id: 'su8-a', name: 'Take Pause', desc: 'Take a moment to enjoy it.', img: '/assets/emotion/surprise/action_8.svg' }
            }
        ]
    }
};

/**
 * Fallback pool.
 */
export const ALL_CARDS = []; 
